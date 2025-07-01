# EliteTracker API – Gerenciador de Hábitos

Esta é a **API Backend** da aplicação **EliteTracker**, desenvolvida com **Node.js + Express + TypeScript**. Ela serve como base para o gerenciamento de **hábitos**, **ciclos de foco** e **métricas de produtividade**, permitindo integração com o frontend e persistência em banco de dados.

## ✨ Funcionalidades

- ✅ Cadastro e autenticação de usuários com JWT
- ✅ Criação, edição e exclusão de hábitos
- ⏱️ Registro de ciclos de foco (Pomodoro)
- 📊 Geração e consulta de métricas mensais e por data
- 🧠 Validação de dados com **Zod**
- 🔐 Proteção de rotas com middlewares de autenticação
- 🌱 Organização modular para facilitar manutenção e escalabilidade

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **Express 5**
- **TypeScript**
- **Mongoose (MongoDB)**
- **Zod** para validação de dados
- **JWT** para autenticação
- **Day.js** para manipulação de datas
- **Dotenv** para variáveis de ambiente

## 📦 Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/gerenciador-de-habitos.git
cd gerenciador-de-habitos
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` com as seguintes variáveis:

```
MONGODB_URI=seu_mongodb_uri
JWT_SECRET=sua_chave_secreta
PORT=3000
```

4. Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

## 🧪 Scripts Disponíveis

- `npm run dev` — Executa a API com `tsx watch`
- `npm run lint` — Corrige automaticamente problemas de lint
- `npm run check:lint` — Verifica problemas de lint
- `npm run format` — Formata o código com Prettier
- `npm run check:format` — Verifica a formatação do código

## 📚 Objetivo Acadêmico

Este projeto foi criado com fins **educacionais**, visando a prática de construção de APIs RESTful seguras, bem organizadas e de fácil manutenção com foco no gerenciamento de tarefas e hábitos.

---

## 📄 Licença

Este projeto está licenciado sob a [ISC License](LICENSE).

---

### Desenvolvido por Evandro Marques – 2025 🚀
