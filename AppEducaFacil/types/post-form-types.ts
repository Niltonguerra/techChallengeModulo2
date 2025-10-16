/*
 * PostForm.types.ts
 *
 * Centralised type definitions used by the PostForm component.  Splitting
 * these interfaces into their own module helps keep the main component
 * focused on behaviour and layout while promoting reuse across files.
 */

/**
 * A mutable string reference used for uncontrolled text inputs.  The
 * current value is stored in the `current` property and can be updated
 * without causing a re-render.
 */
export interface StringRef {
  current: string;
}

/**
 * Structure of a link entry used in the PostForm.  Each entry stores
 * two independent StringRefs for the link's name and URL along with the
 * corresponding initial values so that the TextInputs can display
 * default content when editing an existing post.
 */
export interface LinkEntry {
  nameRef: StringRef;
  urlRef: StringRef;
  initialName: string;
  initialUrl: string;
}

/**
 * Structure of a hashtag entry used in the PostForm.  Each entry stores
 * a single StringRef for the tag text and an initial value to prefill
 * the TextInput when editing.
 */
export interface HashtagEntry {
  tagRef: StringRef;
  initialTag: string;
}

export interface PostFormProps {
	// using for editing existing post
  initialValues?: {
    title?: string;
    introduction?: string;
    description?: string;
    image?: string | null;
    links?: { name?: string; url?: string }[];
    hashtags?: string[];
  };
  onSubmit?: (data: {
    title: string;
    introduction: string;
    description: string;
    image: string | null;
    links: { name: string; url: string }[];
    hashtags: string[];
  }) => void;
}