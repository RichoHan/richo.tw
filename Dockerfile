FROM python:3.6

# Prepare working environments
RUN mkdir -p /home/richo.tw/log
ADD ./requirements.txt /home/richo.tw/requirements.txt
WORKDIR /home/richo.tw

# Install application dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
