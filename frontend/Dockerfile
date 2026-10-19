FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# O Vite precisa da flag --host para expor a porta fora do contentor
CMD ["npm", "run", "dev", "--", "--host"]