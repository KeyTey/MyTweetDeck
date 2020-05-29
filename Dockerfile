FROM python:3.8-slim
COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["gunicorn", "server:app"]
CMD ["-b", "0.0.0.0:80"]
