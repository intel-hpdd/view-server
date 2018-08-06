FROM node:alpine as builder
WORKDIR /build
COPY . .
RUN npm i \
  && npm run postversion

FROM alpine
WORKDIR /root/
COPY --from=builder /build/targetdir .
COPY wait-for-settings.sh /usr/local/bin/
ENTRYPOINT [ "wait-for-settings.sh" ]
CMD ["node", "./bundle.js"]
