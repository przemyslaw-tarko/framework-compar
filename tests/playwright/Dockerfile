FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /work
COPY package.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY tests/playwright/package.json tests/playwright/package.json
RUN npm install

COPY . .
WORKDIR /work/tests/playwright
CMD ["npm", "run", "test"]
