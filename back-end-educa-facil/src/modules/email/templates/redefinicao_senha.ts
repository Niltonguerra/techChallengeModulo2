export const redefinicao_senha = (link: string, nome: string) => `
<div style="font-family: Arial, sans-serif; color: #333">
  <p>Olá, <b>${nome}</b>!</p>
  <p>Você solicitou a redefinição da sua senha.</p>
  <p>Clique no link abaixo para criar uma nova senha:</p>
  <p style="word-break: break-all">
    <a href="${link}" target="_blank" style="color: #1a73e8; text-decoration: underline">
      ${link}
    </a>
  </p>
  <p>Este link é válido por 15 minutos.</p>
</div>
`;
