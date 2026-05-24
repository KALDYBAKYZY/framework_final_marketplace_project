package handlers

import (
	"backend/internal/database"
	"backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateReview(c *gin.Context) {
	uid := getUserIDFromContext(c)

	var review models.Review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if review.Rating < 1 || review.Rating > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Rating must be between 1 and 5"})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, review.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var existing models.Review
	if err := database.DB.Where("user_id = ? AND product_id = ?", uid, review.ProductID).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "You already reviewed this product"})
		return
	}

	review.UserID = uid
	if err := database.DB.Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create review"})
		return
	}

	c.JSON(http.StatusCreated, review)
}

func GetProductReviews(c *gin.Context) {
	productID := c.Param("id")

	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var reviews []models.Review
	database.DB.Where("product_id = ?", productID).Order("created_at DESC").Find(&reviews)

	var avg float64
	database.DB.Model(&models.Review{}).Where("product_id = ?", productID).Select("AVG(rating)").Scan(&avg)

	c.JSON(http.StatusOK, gin.H{
		"reviews":        reviews,
		"average_rating": avg,
		"total":          len(reviews),
	})
}

func GetMyReviews(c *gin.Context) {
	uid := getUserIDFromContext(c)
	var reviews []models.Review
	database.DB.Where("user_id = ?", uid).Order("created_at DESC").Find(&reviews)
	c.JSON(http.StatusOK, reviews)
}
