FROM node as builder
WORKDIR /

COPY package.json  yarn.lock /plugin/

WORKDIR /plugin
RUN  yarn install 


COPY . /plugin/

COPY --from=pontusvisiongdpr/pontus-i18n:latest /*.json  /plugin/src/
#RUN   yarn run build
RUN   yarn run dev


FROM grafana/grafana:latest
EXPOSE 3000

COPY --from=builder /plugin/dist /var/lib/grafana/plugins/grafana/pontus-panel/
#COPY --from=builder /plugin/provisioning/datasources /etc/grafana/provisioning/datasources
ENV TERM=linux
