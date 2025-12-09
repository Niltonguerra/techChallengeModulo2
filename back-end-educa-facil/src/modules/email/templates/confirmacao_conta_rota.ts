export const confirmacao_rota = `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

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
      }

      .card {
        background: #ffffff;
        width: 450px;
        margin: 0 auto;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
      }

      img.logo {
        width: 120px;
        margin-bottom: 15px;
      }

      h1 {
        color: #2d7ff9;
        font-size: 24px;
      }

      p {
        font-size: 16px;
        color: #444;
        line-height: 1.5;
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
        img.logo {
          width: 100px !important;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="card">
        <h1>E-mail verificado!</h1>

        <p>Seu e-mail foi confirmado com sucesso 🎉</p>
        <p>Agora você já pode acessar sua conta e aproveitar todos os recursos do EducaFácil.</p>
      </div>
    </div>
  </body>
</html>
`;
