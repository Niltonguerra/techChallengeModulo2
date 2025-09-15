import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { User } from '../../types/header-types';

interface LoginFormProps {
  onLogin: (userData: User, token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email: email,
        password: senha,
      });

      const userData: User = response.data.user;
      const token: string = response.data.token;

      onLogin(userData, token);

      navigate('/admin');
    } catch (err) {
      setError('Usuário ou senha inválidos. Tente novamente.');
      console.error('Erro de login:', err);
    }
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h1>Login</h1>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <input
        type="email"
        className="dados"
        placeholder="Digite aqui seu e-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
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
    </form>
  );
};

export default LoginForm;
