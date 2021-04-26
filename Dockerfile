FROM ubuntu:16.04

ENV DB_USER root
ENV DB_PASSWORD root

RUN echo "mysql-server mysql-server/root_password password $DB_PASSWORD" | debconf-set-selections
RUN echo "mysql-server mysql-server/root_password_again password $DB_PASSWORD" | debconf-set-selections

RUN apt update && apt install -y software-properties-common \
mysql-server mysql-client \
libmysqlclient-dev libmysqld-dev \
redis-server nginx python-pip \
curl sudo \
language-pack-zh-hant language-pack-zh-hans

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash \
&& export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] \
&& \. "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] \
&& \. "$NVM_DIR/bash_completion" && nvm install v5.6.0 && npm install -g gulp

COPY /koala-online /home/koala/koala-online

WORKDIR /home/koala/koala-online

RUN pip install -r requirements.txt

COPY koala-online/node_modules /home/koala/koala-online/node_modules

COPY gulp-r-index.js /home/koala/koala-online/node_modules/gulp-r/smrt-gulp-r/index.js

RUN cp -r app/static_dev app/static && cp config_offline.py config.py

COPY koala-online/deploy/mysql.cnf /etc/mysql/conf.d/mysql.cnf

RUN rm -f /etc/nginx/sites-enabled/default \
 /etc/nginx/sites-available/default

COPY koala-online/deploy/koala_nginx.conf \
/etc/nginx/conf.d/koala_online.conf

RUN mkdir /data /data/koala_online /data/koala_online/upload /data/bak /data/log

RUN useradd koala && chown koala /data

ENTRYPOINT service mysql start && service redis-server start \
&& mysql -u root -p -e "CREATE DATABASE koala_online" && bash