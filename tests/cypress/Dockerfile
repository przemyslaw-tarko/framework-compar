FROM cypress/included:13.6.4

WORKDIR /work
COPY package.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY tests/cypress/package.json tests/cypress/package.json
RUN npm install

COPY . .
WORKDIR /work/tests/cypress
CMD ["npm", "run", "test"]
