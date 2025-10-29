import { StyleSheet } from 'react-native';

export const userFormStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  imagePickerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  pickImageButton: {
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
  },
  permissionContainer: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitContent: {
    paddingVertical: 8,
  },
  accordionContainer: {
    marginBottom: 16,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "white",
    width: '100%',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
},
  halfButton: {
    flexBasis: "47%",
  },
});