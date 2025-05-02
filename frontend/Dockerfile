FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

# 8. Uruchom aplikację
CMD ["serve", "-s", "dist", "-l", "5000"]

EXPOSE 5000
