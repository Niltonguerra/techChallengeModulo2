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
    isNumberString: string;
  };
  ReturnMessage: {
    sucessPost: string;
    errorPost: string;
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
  };
};
