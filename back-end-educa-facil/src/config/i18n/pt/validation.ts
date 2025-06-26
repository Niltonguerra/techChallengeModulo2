export const validationText: { validation: Record<string, string> } = {
  validation: {
    isString: 'O campo $property não pode estar vazio.',
    isNotEmpty: 'O campo $property não pode estar vazio.',
    isEmail: 'O campo $property precisa ser um e-mail válido.',
    minLength: 'O campo $property deve ter no mínimo $constraint1 caracteres.',
    maxLength: 'O campo $property deve ter no máximo $constraint1 caracteres.',
    Length: 'O campo $property deve ter entre $constraint1 e $constraint2 caracteres.',
    isUUID: 'O campo $property deve ser um UUID válido.',
    isUrl: 'O campo $property deve ser uma URL',
    isArray: 'O campo $property deve ser um array.',
    isObject: 'O campo $property deve ser um objeto.',
  },
};
