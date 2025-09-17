import React from 'react';
import LoginForm from '../../components/Login/LoginForm';
import RegisterBox from '../../components/Login/RegisterBox';
import type { User } from '../../types/header-types';

interface LoginPageProps {
  onLogin: (userData: User, token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <main className="bg">
      <div className="autentificacao">
        <LoginForm onLogin={onLogin} />
        <RegisterBox />
      </div>
    </main>
  );
};

export default LoginPage;
