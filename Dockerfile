ARG IMAGE=node:14.15.0-alpine

FROM $IMAGE as build

WORKDIR .

COPY . .

RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python && \
  npm run build


EXPOSE 4000

CMD ["node", "dist"]
