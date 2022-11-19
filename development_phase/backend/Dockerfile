# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y gcc libxml2 libxslt-dev

RUN apt-get install -y vim

RUN python -m pip install --upgrade pip

RUN pip3 install -r requirements.txt

CMD ["python3", "-m", "gunicorn", "-w", "4", "--thread", "2", "-b",  "0.0.0.0:5000", "wsgi:app"]