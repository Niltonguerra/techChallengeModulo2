export const error_confirmation_route_account = (result: string) => `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Erro na verificação</title>

    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      }

      .container {
        width: 100%;
        padding: 20px 0;
        text-align: center;
        background-color: #f4f4f4;
        min-height: 100vh; /* Garante que ocupa a altura toda */
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .card {
        background: #ffffff;
        width: 450px;
        margin: 0 auto;
        padding: 35px 25px; /* Aumentei um pouco o padding vertical */
        border-radius: 10px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
        border-top: 5px solid #e74c3c; /* Detalhe vermelho no topo */
      }

      /* Estilo do ícone de erro */
      .icon-error {
        width: 60px;
        height: 60px;
        margin-bottom: 15px;
        fill: #e74c3c;
      }

      h1 {
        color: #e74c3c; /* Vermelho para indicar erro */
        font-size: 24px;
        margin-top: 0;
      }

      p {
        font-size: 16px;
        color: #444;
        line-height: 1.5;
        margin-bottom: 10px;
      }

      .error-details {
        color: #666;
        font-size: 14px;
        background-color: #fff0f0;
        padding: 10px;
        border-radius: 5px;
        margin-top: 15px;
        border: 1px solid #ffcccc;
      }

      @media (max-width: 480px) {
        .card {
          width: 90% !important;
          padding: 20px !important;
        }
        h1 {
          font-size: 20px !important;
        }
        p {
          font-size: 15px !important;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="card">
        <svg class="icon-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
          />
        </svg>

        <h1>Falha na verificação</h1>

        <p>Não foi possível confirmar seu e-mail neste momento.</p>

        <div class="error-details">${result}</div>
      </div>
    </div>
  </body>
</html>
`;
