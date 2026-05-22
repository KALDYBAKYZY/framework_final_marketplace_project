package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

type NotifyRequest struct {
	Event string                 `json:"event"`
	Data  map[string]interface{} `json:"data"`
}

func main() {
	r := gin.Default()

	r.POST("/notify", func(c *gin.Context) {
		var req NotifyRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		logEvent(req)

		c.JSON(http.StatusOK, gin.H{"message": "Notification received"})
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	fmt.Println("Notification service running on :" + port)
	log.Fatal(r.Run(":" + port))
}

func logEvent(req NotifyRequest) {
	timestamp := time.Now().Format("2006-01-02 15:04:05")

	switch req.Event {
	case "user_registered":
		fmt.Printf("[%s] EVENT: user_registered | name=%v | email=%v\n",
			timestamp, req.Data["name"], req.Data["email"])
	case "order_created":
		fmt.Printf("[%s] EVENT: order_created | order_id=%v | user_id=%v | total=%.2f\n",
			timestamp, req.Data["order_id"], req.Data["user_id"], req.Data["total_price"])
	default:
		fmt.Printf("[%s] EVENT: %s | data=%v\n", timestamp, req.Event, req.Data)
	}
}
