import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  imagePickerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  pickImageButton: {
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
  descriptionInput: {
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  addButtonContent: {
    flexDirection: 'row-reverse',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkInputsContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  linkName: {
    marginBottom: 8,
  },
  linkUrl: {
    marginBottom: 0,
  },
  hashtagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hashtagInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitContent: {
    paddingVertical: 8,
  },
});
