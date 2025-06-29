import { SystemMessageType } from '../type/systemMessage';

export const systemMessage: SystemMessageType = {
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
  ReturnMessage: {
    sucessPost: 'Post criado com sucesso',
    errorPost: 'Erro ao criar o post',
    sucessUpdatePost: 'Post atualizado com sucesso',
    errorUpdatePost: 'Erro ao atualizar o post',
    sucessDeletePost: 'Post deletado com sucesso',
    errorDeletePost: 'Erro ao deletar o post',
    sucessGetPost: 'Post encontrado com sucesso',
    errorGetPost: 'Erro ao encontrar o post',
    sucessGetPosts: 'Posts encontrados com sucesso',
    errorGetPosts: 'Erro ao encontrar os posts',
    sucessGetPostById: 'Post encontrado com sucesso pelo ID',
    errorGetPostById: 'Erro ao encontrar o post pelo ID',
  },
};
