FROM node:20-bullseye

WORKDIR /work
COPY package.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY tests/selenium/package.json tests/selenium/package.json
RUN npm install

COPY . .
WORKDIR /work/tests/selenium
CMD ["npm", "run", "test"]
