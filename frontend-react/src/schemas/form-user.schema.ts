import { z } from 'zod';

export const formUserSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .nonempty('Nome é obrigatório'),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(48, 'Senha deve ter no máximo 48 caracteres')
    .nonempty('Senha é obrigatória'),
  email: z.string()
    .email('Email inválido')
    .nonempty('Email é obrigatório'),
});
