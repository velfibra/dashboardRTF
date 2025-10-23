# Etapa base
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia o package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto dos arquivos do projeto
COPY . .

# Expõe a porta do Next.js
EXPOSE 3000

# Comando para rodar em modo dev
CMD ["npm", "run", "dev"]
