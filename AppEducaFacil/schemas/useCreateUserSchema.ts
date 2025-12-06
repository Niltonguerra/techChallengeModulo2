import * as z from 'zod';

export const createUserSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'O campo Nome é obrigatório')
    .min(2, 'O campo Nome deve ter entre 2 e 100 caracteres')
    .max(100, 'O campo Nome deve ter entre 2 e 100 caracteres'),

  email: z.string()
    .trim()
    .min(1, 'O campo Email é obrigatório')
    .email('Endereço de email inválido'),

  imageUri: z.any().refine((val) => !!val, { message: 'O campo Foto é obrigatório' }),
  photoAsset: z.any().optional(),
  password: z.string()
    .min(1, 'O campo Senha é obrigatório')
    .min(6, 'O campo Senha deve ter entre 6 e 48 caracteres')
    .max(48, 'O campo Senha deve ter entre 6 e 48 caracteres'),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
