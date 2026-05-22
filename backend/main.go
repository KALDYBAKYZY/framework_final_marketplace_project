package main

import (
	"backend/internal/database"
	"backend/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()

	routes.SetupRoutes(r)

	r.Run(":8000")
}
