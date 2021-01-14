FROM nginx:alpine
LABEL author="Thanos Manalikadis"
# Copy our build folder to html nginx's folder
COPY ./dist/greecemap /usr/share/nginx/html
# Enable ports 80 (HTTP) and 443 (HTTPS)
EXPOSE 80 443
# Run Nginx server without halting (never turn off)
ENTRYPOINT ["nginx","-g","daemon off;"]
