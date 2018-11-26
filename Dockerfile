FROM python:3.6

ADD . /home/richo.tw
WORKDIR /home/richo.tw
RUN mkdir -p /home/richo.tw/log

# Install application dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
