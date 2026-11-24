# syntax=docker/dockerfile:1.7
# Usar uma imagem de Node.js como base (atualize para Node 18)
FROM node:22 AS build

# Definir o diretório de trabalho
WORKDIR /app

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Instalar exatamente as dependências registradas no lockfile
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=npm-ca,required=false \
    if [ -s /run/secrets/npm-ca ]; then \
      NODE_EXTRA_CA_CERTS=/run/secrets/npm-ca npm ci; \
    else \
      npm ci; \
    fi

# Copiar os arquivos da aplicação
COPY . .

RUN CI=false npm run build


# Etapa 2 - Usar nginx para servir os arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000

# Configurar nginx para ouvir na porta 3000
COPY nginx-front.conf /etc/nginx/conf.d/default.conf

# Identidade visual: gera /config.js a partir do .env na subida do container.
# A pasta branding do host é montada em /usr/share/nginx/html/branding.
COPY docker/40-app-config.sh /docker-entrypoint.d/40-app-config.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-app-config.sh \
    && chmod +x /docker-entrypoint.d/40-app-config.sh \
    && mkdir -p /usr/share/nginx/html/branding
