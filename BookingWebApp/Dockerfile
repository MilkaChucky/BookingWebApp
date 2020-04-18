FROM node

COPY . /app
WORKDIR /app

RUN npm install -g @angular/cli
RUN npm install

EXPOSE 4200
CMD ng serve -c docker