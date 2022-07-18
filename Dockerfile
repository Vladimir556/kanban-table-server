FROM node:14.19
WORKDIR /app/server
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "index.js"]