FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .
RUN go build -o notification-service .

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/notification-service .

EXPOSE 8082

CMD ["./notification-service"]
