package routes

import (
	"backend/internal/handlers"
	"backend/internal/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	r.Static("/uploads", "./uploads")

	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	r.GET("/products", handlers.GetProducts)
	r.GET("/products/:id", handlers.GetProduct)
	r.GET("/products/:id/reviews", handlers.GetProductReviews)

	r.GET("/categories", handlers.GetCategories)
	r.GET("/categories/:id", handlers.GetCategory)

	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.GET("/me", handlers.GetMe)

		auth.GET("/users", handlers.GetUsers)
		auth.GET("/users/:id", handlers.GetUser)
		auth.PUT("/users/:id", handlers.UpdateUser)
		auth.DELETE("/users/:id", handlers.DeleteUser)

		auth.POST("/upload", handlers.UploadImage)

		auth.POST("/products", handlers.CreateProduct)
		auth.PUT("/products/:id", handlers.UpdateProduct)
		auth.DELETE("/products/:id", handlers.DeleteProduct)

		auth.POST("/orders", handlers.CreateOrder)
		auth.GET("/orders/my", handlers.GetMyOrders)
		auth.GET("/orders/:id", handlers.GetOrderByID)
		auth.PUT("/orders/:id/status", handlers.UpdateOrderStatus)

		auth.POST("/reviews", handlers.CreateReview)
		auth.GET("/reviews/my", handlers.GetMyReviews)

	}

	admin := r.Group("/")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.AdminMiddleware())
	{
		admin.POST("/categories", handlers.CreateCategory)
		admin.PUT("/categories/:id", handlers.UpdateCategory)
		admin.DELETE("/categories/:id", handlers.DeleteCategory)
	}
}
