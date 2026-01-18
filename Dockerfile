FROM node
RUN apt-get update -y
WORKDIR /app
COPY . /app/
RUN npm install
ENTRYPOINT ["sh", "start.sh"]
