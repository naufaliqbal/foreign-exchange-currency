FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

#copy project files and folders to the current working directory
COPY . .

# install project dependencies
RUN yarn install

EXPOSE 5000

CMD ["yarn", "run", "start"]