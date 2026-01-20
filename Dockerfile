FROM node
RUN apt-get update -y
WORKDIR /app
COPY . .
RUN chmod +x ./src/configs/start.sh
RUN npm install
ENTRYPOINT ["sh", "-c", "./src/configs/start.sh"]
