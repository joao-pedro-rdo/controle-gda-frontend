# Usar uma imagem de Node.js como base (atualize para Node 18)
FROM node:18 AS build
USER root

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o arquivo package.json e yarn.lock para o diretório de trabalho
COPY package.json yarn.lock ./

# Limpar cache do yarn
RUN yarn cache clean

# Instalar as dependências básicas primeiro
RUN yarn install

# 🔧 INSTALAR VERSÕES COMPATÍVEIS DO REACT E CHAKRA UI
RUN yarn add react@^18.2.0 react-dom@^18.2.0
RUN yarn add @chakra-ui/react@^2.8.0 @emotion/react@^11.11.0 @emotion/styled@^11.11.0 framer-motion@^10.16.0

# Instalar outras dependências necessárias
RUN yarn add react-webcam react-icons
RUN yarn add --dev @babel/plugin-proposal-private-property-in-object

# Copiar os arquivos da aplicação
COPY . .

# Definir permissões para react-scripts
RUN chmod +x ./node_modules/.bin/react-scripts

# Construir a aplicação para produção
RUN yarn build

# Etapa 2 - Usar nginx para servir os arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000

# Configurar nginx para ouvir na porta 3000
COPY nginx-front.conf /etc/nginx/conf.d/default.conf

