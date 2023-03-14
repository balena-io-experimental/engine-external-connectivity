FROM node:16-alpine

WORKDIR /app

COPY index.js .

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=1 \
	CMD wget http://127.0.0.1:8080/healthy 2>&1 -O - -q

CMD ["node", "index.js"]
