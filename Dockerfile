# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]


#Start up
#docker build -t geo-proteccion .
#docker run --name geo-proteccion-container -d -p 8080:8080 geo-proteccion
