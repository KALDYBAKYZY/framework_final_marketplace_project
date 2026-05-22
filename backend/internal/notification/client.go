package notification

import (
	"fmt"
	"os"

	"github.com/go-resty/resty/v2"
)

var client = resty.New()

func getServiceURL() string {
	url := os.Getenv("NOTIFICATION_SERVICE_URL")
	if url == "" {
		return "http://localhost:8082"
	}
	return url
}

func SendRegisterEvent(userID uint, name string, email string) {
	url := getServiceURL() + "/notify"
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(map[string]interface{}{
			"event": "user_registered",
			"data": map[string]interface{}{
				"user_id": userID,
				"name":    name,
				"email":   email,
			},
		}).
		Post(url)

	if err != nil {
		fmt.Println("Notification service error:", err)
		return
	}
	fmt.Println("Notification sent, status:", resp.StatusCode())
}

func SendOrderEvent(orderID uint, userID uint, totalPrice float64) {
	url := getServiceURL() + "/notify"
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(map[string]interface{}{
			"event": "order_created",
			"data": map[string]interface{}{
				"order_id":    orderID,
				"user_id":     userID,
				"total_price": totalPrice,
			},
		}).
		Post(url)

	if err != nil {
		fmt.Println("Notification service error:", err)
		return
	}
	fmt.Println("Notification sent, status:", resp.StatusCode())
}
