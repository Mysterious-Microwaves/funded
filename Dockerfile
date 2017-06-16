FROM node:6-slim
# Working directory for application

RUN mkdir -p /code
WORKDIR /code
ADD . /code

# # Download nodemon for development
# RUN npm install --global nodemon

RUN npm install -g yarn
RUN npm install -g nodemon
RUN npm install webpack -g
RUN npm install babel -g
RUN npm install knex -g

RUN yarn
RUN yarn global add grunt-cli knex

EXPOSE 5000

CMD ['npm', 'start']