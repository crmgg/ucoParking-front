FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
ENV VM_API_UPSTREAM=http://34.132.122.87:8000
EXPOSE 8080
CMD ["node", "server.js"]
