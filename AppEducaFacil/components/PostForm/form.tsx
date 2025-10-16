import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  IconButton,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import type {
  StringRef,
  LinkEntry,
  HashtagEntry,
  PostFormProps,
} from '../../types/post-form-types';

import { styles } from './styles';

/**
 * Create a new StringRef with an optional initial value.  This helper
 * function simplifies creation of mutable refs outside of hooks.  The
 * returned object will persist across renders because it is stored
 * inside state or as a ref.
 *
 * @param initial - The initial value for the ref.
 */
function makeStringRef(initial: string = ''): StringRef {
  return { current: initial };
}

// initial values: for editing existing post
const Form: React.FC<PostFormProps> = ({ initialValues = {}, onSubmit = () => {} }) => {
  // Uncontrolled refs for single-value fields
  const titleRef = useRef<string>(initialValues.title ?? '');
  const introductionRef = useRef<string>(initialValues.introduction ?? '');
  const descriptionRef = useRef<string>(initialValues.description ?? '');

  // Selected image URI stored in state so that the preview updates when
  // changed.  Other field values remain uncontrolled via refs.
  const [imageUri, setImageUri] = useState<string | null>(initialValues.image ?? null);

  // Dynamic array of link entries.  Each entry stores its own StringRef
  // objects and initial values.  We initialise based on any provided
  // initialValues.links; otherwise start with a single empty entry.
  const [links, setLinks] = useState<LinkEntry[]>(() => {
    const initialLinks = initialValues.links;
    if (initialLinks && Array.isArray(initialLinks) && initialLinks.length > 0) {
      return initialLinks.map((link) => ({
        nameRef: makeStringRef(link.name ?? ''),
        urlRef: makeStringRef(link.url ?? ''),
        initialName: link.name ?? '',
        initialUrl: link.url ?? '',
      }));
    }
    return [
      {
        nameRef: makeStringRef(''),
        urlRef: makeStringRef(''),
        initialName: '',
        initialUrl: '',
      },
    ];
  });

  // Dynamic array of hashtags.  Each entry stores a StringRef and an
  // initialTag.  Initialise from any provided initialValues.hashtags.
  const [hashtags, setHashtags] = useState<HashtagEntry[]>(() => {
    const initialTags = initialValues.hashtags;
    if (initialTags && Array.isArray(initialTags) && initialTags.length > 0) {
      return initialTags.map((tag) => ({
        tagRef: makeStringRef(tag),
        initialTag: tag,
      }));
    }
    return [
      {
        tagRef: makeStringRef(''),
        initialTag: '',
      },
    ];
  });

  /**
   * Handle picking an image from the device's photo library.  This function
   * requests permission if necessary and then launches the picker.  The
   * selected image URI is stored in state for preview and inclusion in
   * submission data.  Errors are caught and logged.
   */
  const handlePickImage = async (): Promise<void> => {
    try {
      // Request permissions on the first call.  If permission is denied
      // notify the user and abort.
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Permission to access the photo library is required to select an image.'
        );
        return;
      }

      // Launch the image library picker.  The options can be tailored
      // depending on your needs (e.g. allowing editing, specifying
      // quality, etc.).  See the expo-image-picker documentation.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      // Only update the state if the user actually selects an image.
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
      }
    } catch (error) {
      console.warn('Error picking image:', error);
    }
  };

  /**
   * Append a new blank link entry to the links array.  Each new entry
   * contains its own StringRefs so that changes do not interfere with
   * existing entries.  Using functional state updates ensures that we
   * always operate on the latest links array.
   */
  const addLink = (): void => {
    setLinks((prevLinks) => [
      ...prevLinks,
      {
        nameRef: makeStringRef(''),
        urlRef: makeStringRef(''),
        initialName: '',
        initialUrl: '',
      },
    ]);
  };

  /**
   * Remove a link entry by its index.  If only one link exists, removal
   * will be prevented by conditionally rendering the delete button in the
   * JSX below.
   *
   * @param index - The zero‑based index of the link to remove.
   */
  const removeLink = (index: number): void => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  /**
   * Append a new blank hashtag entry to the hashtags array.  As with
   * links, each new entry uses its own StringRef.
   */
  const addHashtag = (): void => {
    setHashtags((prevTags) => [
      ...prevTags,
      {
        tagRef: makeStringRef(''),
        initialTag: '',
      },
    ]);
  };

  /**
   * Remove a hashtag entry by its index.  The delete button is shown only
   * when there are multiple hashtags, preventing removal of the last field.
   *
   * @param index - The zero‑based index of the hashtag to remove.
   */
  const removeHashtag = (index: number): void => {
    setHashtags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  /**
   * Collect values from all uncontrolled inputs and invoke the onSubmit
   * callback.  Values are trimmed to remove leading/trailing whitespace.
   * Empty link entries (where both name and URL are blank) are skipped.
   */
  const handleSubmit = (): void => {
    // Extract and clean link data
    const linkData = links
      .map((entry) => {
        const nameValue = entry.nameRef.current || '';
        const urlValue = entry.urlRef.current || '';
        return { name: nameValue.trim(), url: urlValue.trim() };
      })
      .filter(({ name, url }) => name !== '' || url !== '');

    // Extract and clean hashtag data
    const tagData = hashtags
      .map((entry) => {
        const tagValue = entry.tagRef.current || '';
        return tagValue.trim();
      })
      .filter((tag) => tag !== '');

    // Compose final submission payload
    const payload = {
      title: titleRef.current.trim(),
      introduction: introductionRef.current.trim(),
      description: descriptionRef.current.trim(),
      image: imageUri,
      links: linkData,
      hashtags: tagData,
    };

    onSubmit(payload);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Image selection and preview */}
      <View style={styles.imagePickerSection}>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
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

      {/* Title field */}
      <TextInput
        label="Title *"
        placeholder="Enter a title"
        defaultValue={initialValues.title}
        onChangeText={(text) => {
          titleRef.current = text;
        }}
        mode="outlined"
        style={styles.input}
        returnKeyType="next"
      />

      {/* Introduction field */}
      <TextInput
        label="Introduction *"
        placeholder="Enter an introduction"
        defaultValue={initialValues.introduction}
        onChangeText={(text) => {
          introductionRef.current = text;
        }}
        mode="outlined"
        style={styles.input}
        returnKeyType="next"
      />

      {/* External links section */}
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
      {links.map((link, index) => (
        <View key={`link-${index}`} style={styles.linkRow}>
          <View style={styles.linkInputsContainer}>
            <TextInput
              label="Link name"
              placeholder="e.g. GitHub, documentation"
              defaultValue={link.initialName}
              onChangeText={(text) => {
                link.nameRef.current = text;
              }}
              mode="outlined"
              style={[styles.input, styles.linkName]}
              returnKeyType="next"
            />
            <TextInput
              label="URL"
              placeholder="e.g. https://..."
              defaultValue={link.initialUrl}
              onChangeText={(text) => {
                link.urlRef.current = text;
              }}
              mode="outlined"
              style={[styles.input, styles.linkUrl]}
              keyboardType="url"
              returnKeyType="done"
            />
          </View>
          {links.length > 1 && (
            <IconButton
              icon="delete"
              size={24}
              onPress={() => removeLink(index)}
              accessibilityLabel="Remove link"
            />
          )}
        </View>
      ))}

      {/* Hashtags section */}
      <View style={styles.sectionHeaderContainer}>
        <Button
          mode="text"
          onPress={addHashtag}
          icon="tag-plus"
          contentStyle={styles.addButtonContent}
        >
          Add hashtag
        </Button>
      </View>
      {hashtags.map((tag, index) => (
        <View key={`hashtag-${index}`} style={styles.hashtagRow}>
          <TextInput
            label="Hashtag"
            placeholder="e.g. reactnative"
            defaultValue={tag.initialTag}
            onChangeText={(text) => {
              tag.tagRef.current = text;
            }}
            mode="outlined"
            style={[styles.input, styles.hashtagInput]}
            returnKeyType="done"
          />
          {hashtags.length > 1 && (
            <IconButton
              icon="delete"
              size={24}
              onPress={() => removeHashtag(index)}
              accessibilityLabel="Remove hashtag"
            />
          )}
        </View>
      ))}

      {/* Description field */}
      <TextInput
        label="Description *"
        placeholder="Enter a detailed description"
        defaultValue={initialValues.description}
        onChangeText={(text) => {
          descriptionRef.current = text;
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
        Submit
      </Button>
    </ScrollView>
  );
};


export default Form;