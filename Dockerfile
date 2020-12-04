FROM buildkite/puppeteer
WORKDIR /app
COPY . .
RUN yarn && yarn build
CMD yarn start