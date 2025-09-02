import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { User } from '../../types/header-types'; // Verifique se o caminho para seus tipos está correto

// 1. O componente agora espera receber a função onLogin
interface LoginFormProps {
  onLogin: (userData: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [usuario, setUsuario] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [error, setError] = useState<string>(''); // 2. Estado para guardar mensagens de erro
  const navigate = useNavigate(); // 3. Hook para redirecionar o usuário

  // 4. A função de envio foi reescrita para ser assíncrona e se comunicar com a API
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(''); // Limpa erros anteriores

    try {
      // ATENÇÃO: Substitua a URL abaixo pela URL real do seu backend
      const response = await axios.post('http://api.seuservidor.com/login', {
        username: usuario,
        password: senha,
      });

      // Se o login der certo, chame a função onLogin com os dados do usuário
      const userData: User = response.data.user; // Ajuste isso conforme a resposta da sua API
      onLogin(userData);

      // Redirecione para a página inicial
      navigate('/');
    } catch (err) {
      // Se a API retornar um erro, mostre uma mensagem para o usuário
      setError('Usuário ou senha inválidos. Tente novamente.');
      console.error('Erro de login:', err);
    }
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h1>Login</h1>

      {/* 5. Exibe a mensagem de erro na tela, caso exista */}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <input
        type="text"
        className="dados"
        placeholder="Digite aqui seu usuário"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        className="dados"
        placeholder="Digite aqui sua senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        required
      />
      <input type="submit" className="botao" value="Entrar" />

      {/* <a className="cadastro-dados" href="#">
        Esqueceu a sua senha?
      </a> */}
    </form>
  );
};

export default LoginForm;
