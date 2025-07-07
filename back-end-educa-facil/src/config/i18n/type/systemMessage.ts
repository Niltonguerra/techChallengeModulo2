export type SystemMessageType = {
  validation: {
    isString: string;
    isNotEmpty: string;
    isEmail: string;
    minLength: string;
    maxLength: string;
    Length: string;
    isUUID: string;
    isUrl: string;
    isArray: string;
    isObject: string;
    isBoolean: string;
  };
  ReturnMessage: {
    sucessCreatePost: string;
    sucessCreateUser: string;
    errorCreatePost: string;
    sucessUpdatePost: string;
    errorUpdatePost: string;
    sucessDeletePost: string;
    errorDeletePost: string;
    sucessGetPost: string;
    errorGetPost: string;
    sucessGetPosts: string;
    errorGetPosts: string;
    sucessGetPostById: string;
    errorGetPostById: string;
    errorUserNotFound: string;
  };
};
