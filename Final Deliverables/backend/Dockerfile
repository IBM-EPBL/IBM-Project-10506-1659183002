# syntax=docker/dockerfile:1

FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt

RUN apt update

RUN apt install build-essential -y

RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt

COPY . .

CMD ["python3", "-m", "gunicorn", "-w", "4", "--thread", "2", "-b",  "0.0.0.0:5000", "wsgi:app"]