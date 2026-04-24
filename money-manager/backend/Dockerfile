FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

ENV MONGODB_URI=mongodb+srv://localhost/moneymanager \
    MONGODB_DATABASE=MoneyManager \
    JWT_SECRET=your-secret-key \
    JWT_EXPIRATION=86400000 \
    CORS_ALLOWED_ORIGINS=http://localhost:5173 \
    SERVER_PORT=8081

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]