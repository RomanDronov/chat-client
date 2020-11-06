# base image
FROM node:13

# set working directory
RUN mkdir /client
WORKDIR /client
# add `/app/node_modules/.bin` to $PATH

# install and cache app dependencies
COPY package.json /client
COPY package-lock.json /client
RUN npm install
COPY . /client

# start app
CMD ["npm", "start"]

EXPOSE 3000