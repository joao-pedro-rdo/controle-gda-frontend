# 🚀 Sistema de Controle de Visitantes - Frontend

<div align="center">

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.15-06B6D4?logo=tailwindcss&logoColor=white)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-2.10.4-319795?logo=chakraui&logoColor=white)

### 🏢 Sistema de Controle de Entradas e Saídas para Quartéis

Interface moderna e responsiva para gerenciamento de visitantes, militares e permissionários.

[📚 Repositório Principal](https://github.com/seu-usuario/controle-visitantes-estacionamento) • [🐛 Reportar Bug](https://github.com/seu-usuario/controle-visitantes-estacionamento/issues)

</div>

---

## ⚠️ IMPORTANTE - Em Desenvolvimento

> ⚡ Este projeto está em **desenvolvimento ativo**. Algumas funcionalidades podem estar incompletas ou sujeitas a alterações.

---

## 🎯 Sobre o Projeto

Frontend do Sistema de Controle de Visitantes e Estacionamento, desenvolvido para gerenciar entradas e saídas de pessoas e veículos em instalações militares. O sistema oferece:

- ✅ **Controle em tempo real** de entradas/saídas via QR Code
- 📊 **Relatórios** com filtros
- 📷 **Captura de fotos** integrada
- 📤 **Exportação** de dados para Excel

---

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL da API Backend
REACT_APP_API_URL=http://localhost:5000

# Configurações opcionais
NODE_TLS_REJECT_UNAUTHORIZED=0
FRONTEND_HTTPS=true
```

---

## 💻 Desenvolvimento Local

### ⚠️ ATENÇÃO - Pré-requisito importante!

> **Para desenvolver o frontend localmente, você DEVE ter o backend rodando!**
>
> 📌 **Passos obrigatórios:**
>
> 1. **Backend e banco de dados devem estar rodando** (consulte o [repositório principal](https://github.com/seu-usuario/controle-visitantes-estacionamento))
> 2. **Configure a variável de ambiente** no arquivo `.env`:
>    ```env
>    REACT_APP_API_URL=http://localhost:5000
>    ```
> 3. Certifique-se que o backend está acessível em `http://localhost:5000`

### Inicie o servidor de desenvolvimento

```bash
npm start
# ou
yarn start
```

A aplicação estará disponível em: **http://localhost:3000**

### 🔥 Hot Reload

O projeto está configurado com **hot reload**. Suas alterações serão refletidas automaticamente no navegador!

---

---

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação

- Login com diferentes níveis de acesso (S2, Guarda)
- Controle de rotas por perfil de usuário
- Gerenciamento de sessão com JWT

### 📱 Controle de Entrada/Saída

- Leitura de QR Code via câmera ou leitor físico
- Registro automático de entradas/saídas
- Modal responsivo com informações do usuário
- Suporte para:
  - ✅ Militares (veículos cadastrados)
  - ✅ Visitantes
  - ✅ Permissionários

### 📊 Relatórios

- Filtro por período customizado (data e hora)
- Carregamento automático das últimas 24 horas
- Pesquisa por nome, placa, CPF, identidade
- Filtro por tipo (Todos, Visitantes, Militares, Permissionários)
- Visualização responsiva:
  - **Desktop**: Tabela completa
  - **Mobile**: Cards informativos
- Exportação para Excel

### ⚙️ Configurações (Perfil S2)

- Upload de logo do sistema
- Personalização de imagem de fundo
- Preview em tempo real das alterações

### 📸 Captura de Imagens

- Integração com webcam
- Captura de fotos de visitantes
- Visualização de fotos em relatórios

---

## 🔗 Links Importantes

### 📚 Repositório Principal

Para informações completas sobre como rodar o **sistema completo** (backend + banco de dados + frontend):

👉 **[Acesse o Repositório Principal](https://github.com/seu-usuario/controle-visitantes-estacionamento)**

O repositório principal contém:

- Docker Compose para subir toda a stack
- Documentação completa da API
- Configuração do banco de dados PostgreSQL
- Scripts de inicialização
- Guia de deploy

---

// Desenvolvimento
const API_URL = "http://localhost:5000";

// Produção
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Imagens públicas (logo/background)
const logoUrl = `${API_URL}/system-images/logo.png`;
const bgUrl = `${API_URL}/public/img/background.jpg`;

// Ou melhor ainda, busque da API:
const { logo, background } = await fetch(`${API_URL}/system-images/current`);
