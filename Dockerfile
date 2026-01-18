FROM node
RUN apt-get update -y
WORKDIR /app
COPY . /app/
COPY src/configs/start.sh ./start.sh
RUN chmod +x ./start.sh
RUN npm install
ENTRYPOINT ["sh", "-c", "./start.sh"]
