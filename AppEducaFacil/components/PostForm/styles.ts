import styleGuide from '@/constants/styleGuide';
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
    marginBottom: 16
  },
  descriptionInput: {
    marginBottom: 24,
  },
  sectionHeaderWithTitle: {
   	flexDirection: 'column',
		alignItems: 'flex-start',
		marginBottom: 24,
		marginTop: 16,
  },
	linkRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
	},
  sectionHeaderContainer: {
		flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
		alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
		width: '100%',
  },
	hashtagContainer: {
		marginVertical: 16,
		width: '100%',
	},
	hashtagAnchor: {
  	flex: 1,
  	width: '100%',
	},
  addButtonContent: {
		justifyContent: 'flex-end',
		flex: 1
  },
  linkInputsContainer: {
    flex: 1,
    flexDirection: 'column',
		justifyContent: 'center'
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
		width: '100%',
  },
  hashtagInput: {
    flex: 1,
    width: '100%',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitContent: {
    paddingVertical: 8,
    backgroundColor: styleGuide.palette.main.primaryColor
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
  },
});
