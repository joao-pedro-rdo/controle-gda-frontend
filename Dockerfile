# Usar uma imagem de Node.js como base (atualize para Node 18)
FROM node:22 AS build

# Definir o diretório de trabalho
WORKDIR /app

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copiar o arquivo package.json para o diretório de trabalho
COPY package.json .

# Copiar os arquivos da aplicação
COPY . .

RUN npm install
RUN npm run build


# Etapa 2 - Usar nginx para servir os arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000

# Configurar nginx para ouvir na porta 3000
COPY nginx-front.conf /etc/nginx/conf.d/default.conf