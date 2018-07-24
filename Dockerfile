# FROM kkost/uwsgi-docker
# MAINTAINER kkost

# # Set correct environment variables.
# ENV HOME /root

# # Use baseimage-docker's init process.
# CMD ["/sbin/my_init"]

# # Just add Flask!
# RUN pip install flask

# # Enable uWSGI and nginx
# RUN rm -f /etc/service/uwsgi/down /etc/service/nginx/down

FROM python:3.6

ADD . /home/richo.tw
WORKDIR /home/richo.tw
RUN mkdir -p /home/richo.tw/log

# Install application dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN python --version