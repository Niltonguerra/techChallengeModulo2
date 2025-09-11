import React from 'react';
import phoneIcon from '../assets/img/chamada-telefonica.svg';
import emailIcon from '../assets/img/o-email.svg';

const RegisterBox: React.FC = () => {
  return (
    <div className="cadastro">
      <h1>Faça seu cadastro</h1>
      <a href="#">
        <p className="txt-sec cadastro-dados">
          Não possui cadastro? Cadastre-se aqui
        </p>
      </a>
      <div></div>
      <p className="txt-sec">Dúvidas ou precisa de alguma ajuda?</p>

      {}
      <div className="contato-wrapper">
        <div className="contato-item">
          <img src={phoneIcon} width="18" alt="Ícone de telefone" />
          <a className="cadastro-dados" href="tel:9999999999">
            (99) 9999-9999
          </a>
        </div>
        <div className="contato-item">
          <img src={emailIcon} width="18" alt="Ícone de email" />
          <a
            className="cadastro-dados"
            href="mailto:educacaofacilfiap@gmail.com
"
          >
            educacaofacilfiap@gmail.com{' '}
          </a>
        </div>
      </div>
      {}
    </div>
  );
};

export default RegisterBox;
