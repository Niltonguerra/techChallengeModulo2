import { z } from 'zod';

// Schema de validação do formulário de post, alinhado ao DTO do backend
export const formPostSchema = z.object({
  title: z.string().min(20, 'Título deve ter no mínimo 20 caracteres').max(70, 'Título deve ter no máximo 70 caracteres'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  introduction: z.string().min(50, 'Introdução deve ter no mínimo 50 caracteres').max(500, 'Introdução deve ter no máximo 500 caracteres'),
  external_link: z.record(
    z.string(),
    z.string()
      .url({ message: 'Link deve ser uma URL válida' })
      .max(2048, { message: 'URL muito longa' })
  ).optional(),
  content_hashtags: z.array(z.string().min(1, 'Hashtag não pode ser vazia')).min(1, 'Pelo menos uma hashtag é obrigatória'),
  image: z.any().optional(),
  author_id: z.string().uuid('ID do autor deve ser um UUID válido'),
});
