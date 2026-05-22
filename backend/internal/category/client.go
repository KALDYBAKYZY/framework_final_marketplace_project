package category

import (
	"fmt"
	"os"

	"github.com/go-resty/resty/v2"
)

var client = resty.New()

func getServiceURL() string {
	url := os.Getenv("CATEGORY_SERVICE_URL")
	if url == "" {
		return "http://localhost:8081"
	}
	return url
}

func GetCategories() {
	url := getServiceURL() + "/categories"
	resp, err := client.R().
		SetHeader("Accept", "application/json").
		Get(url)

	if err != nil {
		fmt.Println("Category service error:", err)
		return
	}
	fmt.Println("Category-service response:", resp.StatusCode())
}

func NotifyNewCategory(name string) {
	url := getServiceURL() + "/categories"
	resp, err := client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(map[string]interface{}{
			"name": name,
		}).
		Post(url)

	if err != nil {
		fmt.Println("Category service error:", err)
		return
	}
	fmt.Println("Category-service notified, status:", resp.StatusCode())
}
