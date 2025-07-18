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
    isBoolean: 'O campo $property deve ser um valor booleano.',
  },
  ReturnMessage: {
    FailedToProcessPassword: 'Falha ao processar a senha.',
    isObject: 'O valor deve ser um objeto.',
    isnotEmptyPassword: 'A senha não pode estar vazia.',
    NotAcess: 'Você não tem permissão para acessar este recurso.',
    errorFindUser: 'Erro ao encontrar o usuário',
    errorCreateUser: 'Erro ao criar o usuário',
    errorlogin: 'credenciais inválidas',
    sucessCreatePost: 'Post criado com sucesso',
    sucessCreateUser: 'Usuário criado com sucesso',
    errorCreatePost: 'Erro ao criar o post',
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
    errorUserNotFound: 'Usuário não encontrado',
    errorSendEmail: 'Erro ao enviar o e-mail',
    sucessCreateUserValidationEmail:
      'Usuário criado com sucesso. Verifique seu e-mail para ativar sua conta.',
  },
};
