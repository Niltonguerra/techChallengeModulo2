import React, { useState, useEffect } from "react";
import { View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput, Button, IconButton, Text, HelperText } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Chip } from 'react-native-paper';


import type { FormPostProps } from "@/types/postForm";

import { styles } from "./styles";
import {
  createPost,
  getHashtags,
  getListById,
  updatePost,
} from "@/services/post";
import { imgbbUmaImagem } from "@/services/imgbb";
import Loading from "../Loading";
import { useSnackbar } from "@/hooks/snackbar/snackbar";

/**
 * @param postId: for editing existing posts
 * @param afterSubmit: callback function to be called after submission
 */
const Form: React.FC<FormPostProps> = ({ postId = null, afterSubmit }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [description, setDescription] = useState("");

  let auxScreenWidth = window.innerWidth;

  const [imageUri, setImageUri] = useState<File | string | null>(null);
  const [photoAsset, setPhotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagOptions, setHashtagOptions] = useState<string[]>();

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    introduction?: string;
    content_hashtags?: string;
    image?: string;
    links?: string[];
  }>({});

  useEffect(() => {
    if (postId) {
      getListById(postId)
        .then((data) => {
          if (data) {
            let auxData = data.ListPost[0];

            setTitle(auxData.title || "");
            setIntroduction(auxData.introduction || "");
            setDescription(auxData.description || "");
            setImageUri(auxData.image || null);
            setHashtags(auxData.content_hashtags || []);
            setExternalLinks(() => {
              const initialLink = auxData.external_link;
              if (
                initialLink &&
                typeof initialLink === "object" &&
                Object.keys(initialLink).length
              ) {
                let auxLinks: { name: string; url: string }[] = [];
                for (const [name, url] of Object.entries(initialLink)) {
                  auxLinks.push({ name: name || "", url: url || "" });
                }
                return auxLinks;
              }
              return [{ name: "", url: "" }];
            });
            setLoading(false);
          } else {
            showSnackbar({message: "Ocorreu um erro ao enviar o formulário."});

          }
        })
        .catch((err) => {
          console.error("err getting post data:", err);
          showSnackbar({message: "Ocorreu um erro ao enviar o formulário."});
        });
    } else {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    getHashtags()
      .then((data) => {
        setHashtagOptions(data || []);
      })
      .catch((err) => {
        console.error("Error fetching hashtags:", err);
        setHashtagOptions([]);
      });
  }, []);


  const [externalLinks, setExternalLinks] = useState<
    { name: string; url: string }[]
  >(() => {
    if (!postId) return [{ name: "", url: "" }];
    return [];
  });

  const handlePickImage = async (): Promise<void> => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        showSnackbar({message: "Permission to access the photo library is required to select an image."});
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7, 
      });

      if (result.canceled || !result.assets?.length) return;

      const photoAsset = result.assets[0];
      setImageUri(photoAsset.uri);
      setPhotoAsset(photoAsset);
    } catch (error) {
      console.warn("Error picking image:", error);
    }
  };
  /**
   * adding empty link if the user clicks the add new button
   */
  const addLink = (): void => {
    setExternalLinks((prevLinks) => [...prevLinks, { name: "", url: "" }]);
  };

  /**
   * Removing a link entry using the index
   *
   * @param index: index of the link to be removed (starting from 0)
   */
  const removeLink = (index: number): void => {
    setExternalLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const standardizeTagName= (t: string) => {
    const s = t.trim().replace(/\s+/g, '-'); 
    if (!s) return '';
    const prefixed = s.startsWith('#') ? s : `#${s}`;
    return prefixed.toLowerCase();
  };

  const [query, setQuery] = useState('');

  const filteredOptions = (hashtagOptions ?? [])
    .filter(o =>
      o.toLowerCase().includes(query.trim().toLowerCase())
    )
    .filter(o => !hashtags.some(h => h.toLowerCase() === o.toLowerCase()))
    .slice(0, 8);

  const addTypedHashtag = (text: string) => {
    const tag = standardizeTagName(text);
    if (!tag) return;
    if (hashtags.some(h => h.toLowerCase() === tag.toLowerCase())) return;

    setHashtags(prev => [...prev, tag]);

    setQuery('');
  };

  const verifyLinks = (): boolean => {
    const auxLinkNames = new Set<string>();
    let auxCount = 0;    
    let auxLinkErrors: string[] = [];
    let anyError = false;
    for (const externalLink of externalLinks) {
      auxLinkErrors.push("");
      if (
        (externalLink.name && !externalLink.url) ||
        (!externalLink.name && externalLink.url)
      ) {
        if (!externalLink.name) {
          auxLinkErrors[auxCount] =
            "Todos os links externos devem ter um nome.";
          anyError = true;
        }
        if (!externalLink.url) {
          auxLinkErrors[auxCount] =
            "Todos os links externos devem ter uma URL.";
          anyError = true;
        }
      }
      if (auxLinkNames.has(externalLink.name)) {
        auxLinkErrors[auxCount] =
          "Nomes de links externos não podem se repetir.";
        anyError = true;
      }
      auxCount++;
      auxLinkNames.add(externalLink.name);
    }
    if(anyError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        links: auxLinkErrors,
      }));
    }

    return !anyError;
  };

   const validate = (): boolean => {
    const linksOk = verifyLinks();
    if (!linksOk) return false;

    const newErrors: {
      title?: string;
      description?: string;
      introduction?: string;
      content_hashtags?: string;
      image?: string;
    } = {};

    const withingLen = (s: string, min: number, max: number) => {
      const t = s.trim();
      return t.length >= min && t.length <= max;
    };
    const isUrl = (v: string) => {
      try {
        const u = new URL(v);
        return !!u.protocol && !!u.host;
      } catch {
        return false;
      }
    };

    if (!title) {
      newErrors.title = "O campo Título é obrigatório.";
    } else if (!withingLen(title, 20, 70)) {
      newErrors.title = "O Título deve ter entre 20 e 70 caracteres.";
    }

    if (!description) {
      newErrors.description = "O campo Descrição é obrigatório.";
    } else if (!withingLen(description, 50, 500)) {
      newErrors.description = "A Descrição deve ter entre 50 e 500 caracteres.";
    }

    if (introduction != null && introduction !== "") {
      if (typeof introduction !== "string") {
        newErrors.introduction = "Introdução deve ser um texto.";
      } else if (!withingLen(introduction, 50, 500)) {
        newErrors.introduction =
          "A Introdução deve ter entre 50 e 500 caracteres.";
      }
    }

    if (!Array.isArray(hashtags) || hashtags.length === 0) {
      newErrors.content_hashtags = "Informe ao menos uma hashtag de conteúdo.";
    } else {
      for (const tag of hashtags) {
        if (typeof tag !== "string" || tag.trim() === "") {
          newErrors.content_hashtags = "Todas as hashtags de conteúdo devem ser válidas.";
          break;
        }
      }
    }

    if (!imageUri) {
      newErrors.image = "A imagem é obrigatória.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    const linkData: Record<string, string> = {};
    externalLinks.forEach((externalLink) => {
      if (externalLink.name && externalLink.url) {
        linkData[externalLink.name] = externalLink.url;
      }
    });

    if (!validate()) {
      return;
    }

    setLoading(true);

    const payload = {
      title,
      introduction,
      description,
      image: imageUri,
      external_link: linkData,
      content_hashtags: hashtags,
    };

    if(photoAsset) {
      try {
        const cdn = await imgbbUmaImagem(photoAsset);
        payload.image = cdn.data?.url || cdn.data?.display_url;
      } catch {
        showSnackbar({message: "Erro ao fazer upload da imagem! Favor contactar o suporte."});
        return;
      }
    }
    

    const actionFunction = postId ? updatePost : createPost;

    actionFunction(postId ? { id: postId, ...payload } : payload)
      .then((response) => {
        showSnackbar({message: `Post ${postId ? "atualizado" : "criado"} com sucesso!`});
        if (afterSubmit) afterSubmit();
      })
      .catch((error) => {
        console.error("Error submitting post:", error);
        showSnackbar({message: `Houve um erro ao ${postId ? "atualizar" : "criar"} o post. Por favor, tente novamente.`});
      }).finally(() => {
        setLoading(false);
      });
  };

  if(loading) {
    return <Loading loadingText={postId ? 'Carregando dados...' : 'Carregando...'} />;
  }

  return (
     <KeyboardAwareScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
    enableOnAndroid={true}
    keyboardOpeningTime={0}
    extraScrollHeight={45}
    enableAutomaticScroll
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
  >
      <View style={styles.imagePickerSection}>
        {imageUri && (
          <Image
            source={{ uri: imageUri ? imageUri.toString() : "" }}
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
          {imageUri ? "Change Image" : "Select Image"}
        </Button>
        {errors.image && (
          <HelperText type="error" style={styles.errorText} visible>
            {errors.image}
          </HelperText>
        )}
      </View>

      <TextInput
        label="Título *"
        placeholder="Digite um título"
        value={title || ""}
        onChangeText={(text) => {
          setTitle(text);
        }}
        mode="outlined"
        style={styles.input}
        returnKeyType="next"
      />
      {errors.title && (
        <HelperText type="error" style={styles.errorText} visible>
          {errors.title}
        </HelperText>
      )}
      <TextInput
        label="Introdução *"
        placeholder="Digite uma introdução"
        value={introduction || ""}
        onChangeText={(text) => {
          setIntroduction(text);
        }}
        mode="outlined"
        style={styles.input}
        returnKeyType="next"
      />
      {errors.introduction && (
        <HelperText type="error" style={styles.errorText} visible>
          {errors.introduction}
        </HelperText>
      )}

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
          {errors.links && errors.links[index] && (
            <HelperText type="error" style={styles.errorText} visible>
              {errors.links[index]}
            </HelperText>
          )}
        </View>
      ))}

      {/* hashtags (select/autocomplete and free text) */}
      <View style={styles.hashtagContainer}>
        <Text style={{ marginBottom: 4, fontWeight: "bold" }}>Hashtags*</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8, width: auxScreenWidth * 0.92 }}>
          {hashtags.map((tag, idx) => (
            <Chip
              key={tag + idx}
              style={{ margin: 4 }}
              onClose={() => setHashtags(hashtags.filter((_, i) => i !== idx))}
              mode="outlined"
            >
              {tag}
            </Chip>
          ))}
        </View>
        <TextInput
          label="Adicionar hashtag"
          placeholder="Selecione ou crie uma hashtag"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={(e) => addTypedHashtag(e.nativeEvent.text)}
          style={[styles.input, { width: auxScreenWidth * 0.92, flexShrink: 1 }]}
          returnKeyType="done"
        />
        {filteredOptions.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
            {filteredOptions.map((option, idx) => (
              <Chip
                key={option + idx}
                style={{ margin: 4 }}
                onPress={() => addTypedHashtag(option)}
                mode="outlined"
              >
                {option}
              </Chip>
            ))}
          </View>
        )}
        {query.trim().length > 0 && filteredOptions.length === 0 && (
          <Button mode="text" onPress={() => addTypedHashtag(query)}>
            Usar “{standardizeTagName(query)}”
          </Button>
        )}

        {errors.content_hashtags && (
          <HelperText type="error" style={styles.errorText} visible>
            {errors.content_hashtags}
          </HelperText>
        )}
      </View>

      <TextInput
        label="Descrição *"
        placeholder="Digite uma descrição detalhada"
        value={description || ""}
        onChangeText={(text) => {
          setDescription(text);
        }}
        mode="outlined"
        style={styles.descriptionInput}
        multiline
        numberOfLines={4}
      />
      {errors.description && (
        <HelperText type="error" style={styles.errorText} visible>
          {errors.description}
        </HelperText>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={[styles.submitButton, { flex: 1, marginRight: 6 }]}
          contentStyle={styles.submitContent}
        >
          Voltar
        </Button>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={[styles.submitButton, { flex: 1, marginLeft: 6 }]}
          contentStyle={styles.submitContent}
        >
          {postId ? "Atualizar Post" : "Criar"}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Form;
