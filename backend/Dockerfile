# Sử dụng image JDK 17 hoặc 11
FROM openjdk:17 AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép pom.xml để tải các dependency
COPY pom.xml .

# Chạy Maven để download các dependencies mà không cần chạy các bài test
RUN mvn dependency:go-offline

# Sao chép mã nguồn vào thư mục /app/src trong container
COPY src ./src

# Chạy Maven để build ứng dụng
RUN mvn clean package -DskipTests

# Tạo một image mới cho runtime
FROM openjdk:17

WORKDIR /app

# Sao chép file JAR đã build từ image builder
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port ứng dụng sẽ chạy
EXPOSE 8080

# Lệnh để chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
