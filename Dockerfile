FROM node:14-buster as builder
WORKDIR /

COPY package.json  yarn.lock /plugin/

WORKDIR /plugin

RUN yarn  install 

COPY . /plugin/

COPY --from=pontusvisiongdpr/pontus-i18n:latest /*.json  /plugin/src/

ENV NODE_ENV=development
#RUN yarn run dev
RUN   yarn run build
RUN   yarn audit || [ "$?" -lt 8 ]

ARG GRAFANA_API_KEY
ENV GRAFANA_API_KEY=${GRAFANA_API_KEY}
#RUN echo $GRAFANA_API_KEY
#RUN npm config set ignore-scripts true
#RUN   npx  @grafana/toolkit@8.5.4 plugin:sign --legacy-peer-deps
#RUN yarn run build:sign  --rootUrls https://pv-demo,https://lgpd-prod,https://scrlgpd,https://pv-demo.pgr.mpf.mp.br,https://pontus-admin,https://pontus
#RUN yarn run   dev

#FROM grafana/grafana:7.5.11-ubuntu
FROM grafana/grafana:8.5.4-ubuntu

EXPOSE 3000

COPY --from=builder /plugin/dist /var/lib/grafana/plugins/grafana/pontus-panel/
#COPY --from=builder /plugin/provisioning/datasources /etc/grafana/provisioning/datasources
ENV TERM=linux
