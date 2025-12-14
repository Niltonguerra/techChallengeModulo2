export const account_confirmation = (linkVerification: string) => `
<div style="font-family: Arial, sans-serif; color: #333;">
  <img src="https://seusite.com/logo.png" alt="EducaFácil" style="width: 120px; margin-bottom: 20px;" />

  <p>Olá!</p>
  <p>Obrigado por se cadastrar no <b>EducaFácil</b>.</p>
  <p>Para ativar sua conta, clique no link abaixo:</p>

  <p style="word-break: break-all;">
    <a href="${linkVerification}" target="_blank" style="color: #1a73e8;">
      ${linkVerification}
    </a>
  </p>

  <p>Caso você não tenha solicitado este cadastro, ignore este e-mail.</p>
</div>`;
