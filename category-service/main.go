package main

import (
	"category-service/database"
	"category-service/handlers"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()

	// CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	r.POST("/categories", handlers.CreateCategory)
	r.GET("/categories", handlers.GetCategories)
	r.GET("/categories/:id", handlers.GetCategory)
	r.DELETE("/categories/:id", handlers.DeleteCategory)

	r.Run(":8081")
}
