FROM ubuntu:16.04

ENV DB_USER root
ENV DB_PASSWORD root
ENV DB_NAME koala-online

RUN echo "mysql-server mysql-server/root_password password $DB_PASSWORD" | debconf-set-selections
RUN echo "mysql-server mysql-server/root_password_again password $DB_PASSWORD" | debconf-set-selections

COPY koala-online/deploy/mysql.cnf /etc/mysql/conf.d/koala.conf

RUN apt update && apt install -y software-properties-common \
mysql-server mysql-client \
libmysqlclient-dev libmysqld-dev \
redis-server nginx python-pip && pip install virtualenv

RUN service mysql start \
&& service redis-server start \
&& service nginx start

RUN rm -f /etc/nginx/sites-enabled/default \
 /etc/nginx/sites-available/default

COPY koala-online/deploy/koala_nginx.conf \
/etc/nginx/conf.d/koala_online.conf

RUN mkdir /data /data/koala_online /data/koala_online/upload /data/bak

RUN useradd koala && chown koala /data

COPY /koala-online /home/koala/koala-online

WORKDIR /home/koala/koala-online




