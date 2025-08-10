# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# React Complete Project

Este é um projeto React completo configurado com as melhores práticas e ferramentas mais utilizadas no mercado.

## 🚀 Tecnologias

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server ultra-rápido
- **React Router DOM** - Roteamento
- **Redux Toolkit** - Gerenciamento de estado
- **ESLint** - Linting e análise de código
- **Prettier** - Formatação de código

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
npm run lint:fix

# Formatação
npm run format
npm run format:check

# Type checking
npm run type-check
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── Navbar.tsx
├── pages/              # Páginas da aplicação
│   ├── Home.tsx
│   └── About.tsx
├── store/              # Redux store
│   ├── index.ts        # Configuração da store
│   ├── hooks.ts        # Hooks tipados do Redux
│   └── slices/         # Slices do Redux Toolkit
│       └── counterSlice.ts
├── App.tsx             # Componente principal
├── App.css             # Estilos globais
└── main.tsx            # Entry point
```

## 🎯 Funcionalidades

### Redux Toolkit
- Store configurada com TypeScript
- Slice exemplo (counter)
- Hooks tipados (`useAppDispatch`, `useAppSelector`)

### React Router
- Roteamento configurado
- Navegação entre páginas (Home, About)
- Navbar com links

### ESLint + Prettier
- Configuração completa para React + TypeScript
- Integração entre ESLint e Prettier
- Scripts para formatação e linting automáticos

### TypeScript
- Configuração otimizada para React
- Tipagem completa em todos os componentes
- Strict mode habilitado

## 🔧 Como usar

1. **Clonar e instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar no navegador:**
   ```
   http://localhost:5173
   ```

## 📋 Como foi criado

```bash
# 1. Criar projeto com Vite
npm create vite@latest frontend-react -- --template react-ts

# 2. Instalar dependências principais
npm install react-router-dom @reduxjs/toolkit react-redux

# 3. Instalar dev dependencies (ESLint)
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh

# 4. Instalar Prettier e integração
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
