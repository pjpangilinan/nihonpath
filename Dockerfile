FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
RUN echo 'server { listen 80; root /usr/share/nginx/html; index pages/index.html; location / { try_files $uri $uri/ =404; } }' > /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html/
