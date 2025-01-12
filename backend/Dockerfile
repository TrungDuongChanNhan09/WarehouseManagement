# Sử dụng image JDK 17 hoặc 11 (tùy thuộc vào phiên bản Java bạn sử dụng)
FROM openjdk:17

# Đặt thư mục làm việc
WORKDIR /app

ARG FILE_JAR=target/backend-0.0.1-SNAPSHOT.jar
# Sao chép file JAR từ target sang container
COPY ./target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port của ứng dụng (ví dụ 8080)
EXPOSE 4357

# Lệnh để chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
