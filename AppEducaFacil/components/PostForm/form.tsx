import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  Alert,
	Pressable,
} from 'react-native';
import {
  TextInput,
  Button,
  IconButton,
	Text,
	Menu,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import type {
  FormPostData,
  FormPostProps,
} from '@/types/form-post';

import { styles } from './styles';
import { createPost, getHashtags, getListById, updatePost } from '@/services/post';

/**
 * @param postId: for editing existing posts
 * @param afterSubmit: callback function to be called after submission
*/
const Form: React.FC<FormPostProps> = ({ postId = null, afterSubmit }) => {
	const [loading, setLoading] = useState(true);

	// string states
	const [title, setTitle] = useState('');
	const [introduction, setIntroduction] = useState('');
	const [description, setDescription] = useState('');

	let auxScreenWidth = window.innerWidth;
	console.log({auxScreenWidth})

 	// image
  const [imageUri, setImageUri] = useState<File | string | null>(null);

	const [hashtags, setHashtags] = useState<string[]>([""]);
	const [hashtagOptions, setHashtagOptions] = useState<string[]>();
	const [hashTagSelectMenu, setHashTagSelectMenu] = useState<{ isOpen: boolean; selectedTag: number }>({ isOpen: false, selectedTag: -1 });

	// getting the info of the existing post, if we are editing
 	useEffect(() => {
		if (postId) {
			// Fetch the post data and set initial values
			getListById(postId).then((data) => {
				if(data) {
					let auxData = data.ListPost[0];

					console.log('ediiting post data: ', auxData);

					setTitle(auxData.title || '');
					setIntroduction(auxData.introduction || '');
					setDescription(auxData.description || '');
					setImageUri(auxData.image || null);
					setHashtags(auxData.content_hashtags || []);
					setExternalLinks(() => {
						const initialLink = auxData.external_link;
						if (initialLink && typeof initialLink === 'object' && Object.keys(initialLink).length) {
							let auxLinks: { name: string; url: string }[] = [];
							for (const [name, url] of Object.entries(initialLink)) {
								auxLinks.push({ name: name || '', url: url || '' });
							}
							return auxLinks;
						}
						return [{ name: '', url: '' }];
					});
					setLoading(false);
				} else {
					Alert.alert('Erro', 'Não foi possível carregar os dados do post para edição.');
				}
			}).catch((err) => {
				console.log('err getting post data:', err);
				Alert.alert('Erro', err.message || 'Não foi possível carregar os dados do post para edição.');
			});
		} else {
			setLoading(false);
		}
	}, [postId]);

	// getting hashtag options
	useEffect(() => {
		console.log('getting hashtags');
		getHashtags().then((data) => {
			setHashtagOptions(data || []);
		}).catch((err) => {
			console.error('Error fetching hashtags:', err);
			setHashtagOptions([]);
		});
	}, []);

	// initializing links
	const [externalLinks, setExternalLinks] = useState<{ name: string; url: string }[]>(() => {
		if(!postId) return [{ name: '', url: '' }];
		return [];
	});

  
  /**
	 * Dealing with the img upload. for that we need to ask for permission and then open the image picker.
   */
  const handlePickImage = async (): Promise<void> => {
    try {
      // Requesting permissions to use library
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Permission to access the photo library is required to select an image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7, // i might just be old but i remember a bug if you set quality to 1
      });

      // only update the state if the user actually selects an image
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
      }
    } catch (error) {
      console.warn('Error picking image:', error);
    }
  };
	/**
 	* adding empty link if the user clicks the add new button
 	*/
	const addLink = (): void => {
		setExternalLinks((prevLinks) => [...prevLinks, { name: '', url: '' }]);
	};

  /**
   * Adding a new empty hashtag if the user clicks the add new button
   */
  const addHashtag = (): void => {
    setHashtags((prevTags) => [
      ...prevTags,
      '',
		]);
  };

	/**
	 * Removing a link entry using the index
	 *
	 * @param index: index of the link to be removed (starting from 0)
	 */
	const removeLink = (index: number): void => {
		setExternalLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
	};

  /**
   * Removing a hashtag entry using the index
   *
   * @param index: index of the hashtag to be removed (starting from 0)
   */
  const removeHashtag = (index: number): void => {
    setHashtags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

	/**
   * Toggle the visibility of a hashtag's dropdown menu.  only one can be open at a time
   */
  const toggleHashtagMenu = (index: number): void => {
    setHashTagSelectMenu((prev) => ({
			isOpen: prev.isOpen && prev.selectedTag === index ? false : true,
			selectedTag: index,
		}));
  };

	// if a link has either only the name or the url filled, we throw an error
	// also there cant be repeated or empty names since they are used as keys in the backend
	const verifyLinks = (): boolean => {
		const auxLinkNames = new Set<string>();
		for (const externalLink of externalLinks) {
			if ((externalLink.name && !externalLink.url) || (!externalLink.name && externalLink.url)) {
				if(!externalLink.name) {
					Alert.alert('Todos os links externos devem ter um nome.', 'Por favor, preencha o nome do link externo ou deixe ambos os campos vazios.');
					return false;
				}
				if(!externalLink.url) {
					Alert.alert('Todos os links externos devem ter uma URL.', 'Por favor, preencha a URL do link externo ou deixe ambos os campos vazios.');
					return false;
				}
			}
			if (auxLinkNames.has(externalLink.name)) {
				Alert.alert('Nome de link duplicado', `O nome do link "${externalLink.name}" já está em uso.`);
				return false;
			}
			auxLinkNames.add(externalLink.name);
		}
		return true;
	};

  const handleSubmit = (): void => {
    // parses link data
    const linkData: Record<string, string> = {};
    externalLinks.forEach((externalLink) => {
      if (externalLink.name && externalLink.url) {
        linkData[externalLink.name] = externalLink.url;
      }
    });

		let auxLinkVerification = verifyLinks();
		console.log({auxLinkVerification})
		if(!auxLinkVerification) return;

    // Compose final submission payload
    const payload = {
      title,
      introduction,
      description, 
      image: imageUri,
      external_link: linkData,
      content_hashtags: hashtags,
    };

		const actionFunction = postId ? updatePost : createPost;

		actionFunction(postId ? { id: postId, ...payload } : payload).then((response) => {
			Alert.alert('Success', `Post ${postId ? 'atualizado' : 'criado'} com sucesso!`);
			if (afterSubmit) afterSubmit();
		}).catch((error) => {
			console.error('Error submitting post:', error);
			Alert.alert('Error', error.message || `Houve um erro ao ${postId ? 'atualizar' : 'criar'} o post. Por favor, tente novamente.`);
		});
  };

  return (
    <ScrollView
			style={{ flex: 1 }}
			contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
			keyboardShouldPersistTaps="handled"
    >
      {/* image selection and preview */}
      <View style={styles.imagePickerSection}>
        {imageUri && (
          <Image
            source={{ uri: imageUri ? imageUri.toString() : '' }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        )}
        <Button
          mode="outlined"
          onPress={handlePickImage}
          icon="image"
          style={styles.pickImageButton}
        >
          {imageUri ? 'Change Image' : 'Select Image'}
        </Button>
      </View>

      <TextInput
        label="Título *"
        placeholder="Digite um título"
        value={title || ''}
        onChangeText={(text) => {
          setTitle(text);
        }}
        mode="outlined"
        style={styles.input}
        returnKeyType="next"
      />
      <TextInput
        label="Introdução *"
        placeholder="Digite uma introdução"
        value={introduction || ''}
        onChangeText={(text) => {
          setIntroduction(text);
        }}
        mode="outlined"
        style={styles.input}
        returnKeyType="next"
      />

      {/* external links */}
      <View style={styles.sectionHeaderContainer}>
        <Button
          mode="text"
          onPress={addLink}
          icon="plus"
          contentStyle={styles.addButtonContent}
        >
          Add link
        </Button>
      </View>
      {externalLinks.map((link, index) => (
        <View key={`link-${index}`} style={styles.linkRow}>
          <View style={styles.linkInputsContainer}>
            <TextInput
              label="Nome do link *"
              placeholder="e.g. GitHub, documentation"
              value={link.name}
              onChangeText={(text) => {
                setExternalLinks((prevLinks) => {
									const newLinks = [...prevLinks];
									newLinks[index].name = text;
									return newLinks;
								});
              }}
              mode="outlined"
              style={[styles.input, styles.linkName]}
              returnKeyType="next"
            />
            <TextInput
              label="URL"
              placeholder="e.g. https://..."
              value={link.url}
              onChangeText={(text) => {
                setExternalLinks((prevLinks) => {
									const newLinks = [...prevLinks];
									newLinks[index].url = text;
									return newLinks;
								});
              }}
              mode="outlined"
              style={[styles.input, styles.linkUrl]}
              keyboardType="url"
              returnKeyType="done"
            />
          </View>
          {externalLinks.length > 1 && (
            <IconButton
              icon="delete"
              size={24}
              onPress={() => removeLink(index)}
              accessibilityLabel="Remover link"
            />
          )}
        </View>
      ))}

      {/* hashtags */}
      <View style={styles.hashtagContainer}>
				<Button
          mode="text"
          onPress={addHashtag}
          icon="plus"
          contentStyle={styles.addButtonContent}
        >
          Add hashtag
        </Button>
        {hashtags.map((hashtag, index) => (
          <View key={`hashtag-${index}`} style={styles.hashtagRow}>
            <Menu
              visible={hashTagSelectMenu.isOpen && hashTagSelectMenu.selectedTag === index}
              onDismiss={() => toggleHashtagMenu(index)}
              anchor={
									<Pressable style={styles.hashtagAnchor} onPress={() => toggleHashtagMenu(index)}>
										<TextInput
											label="Hashtag*"
											placeholder="Selecione uma opção"
											value={hashtag}
											editable={false}
											mode="outlined"
											style={[{ width: auxScreenWidth * 0.92 }, styles.input]}
											right={
												hashtags.length > 1 && (
													<TextInput.Icon
														icon="delete"
														onPress={() => removeHashtag(index)}
														forceTextInputFocus={false}
														accessibilityLabel="Remover hashtag"
													/>
												)
											}
										/>
									</Pressable>
              }
            >
              {hashtagOptions && hashtagOptions.map((option) => (
                <Menu.Item
                  key={option}
                  title={option}
									style={{ width: auxScreenWidth }}
                  onPress={() => {
										setHashtags((prevTags) => {
											const newTags = [...prevTags];
											newTags[index] = option;
											return newTags;
										});
										toggleHashtagMenu(index);
									}}
                />
              ))}
            </Menu>        
          </View>
        ))}
      </View>

      <TextInput
        label="Descrição *"
        placeholder="Digite uma descrição detalhada"
        value={description || ''}
        onChangeText={(text) => {
          setDescription(text);
        }}
        mode="outlined"
        style={styles.descriptionInput}
        multiline
        numberOfLines={4}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        contentStyle={styles.submitContent}
      >
				{postId ? 'Atualizar Post' : 'Criar'}
      </Button>
    </ScrollView>
  );
};


export default Form;