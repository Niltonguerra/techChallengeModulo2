import { z } from 'zod';

export const formQuestionSchema = z.object({
  title: z.string()
    .min(5, 'Título deve ter no mínimo 5 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres')
    .nonempty('Título é obrigatório'),
  description: z.string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .nonempty('Descrição é obrigatória'),
  tags: z.array(z.string())
    .nonempty('Matéria é obrigatória'),
  author_id: z.string()
    .nonempty('ID do autor é obrigatório'),
});
