package handlers

import (
	"backend/internal/database"
	"backend/internal/models"
	"backend/internal/notification"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	uid := getUserIDFromContext(c)

	var input struct {
		Items []struct {
			ProductID uint `json:"product_id"`
			Quantity  int  `json:"quantity"`
		} `json:"items"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(input.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order must have at least one item"})
		return
	}

	var totalPrice float64
	var orderItems []models.OrderItem

	for _, item := range input.Items {
		var product models.Product
		if err := database.DB.First(&product, item.ProductID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		if product.Stock < item.Quantity {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Not enough stock for " + product.Name})
			return
		}
		itemTotal := product.Price * float64(item.Quantity)
		totalPrice += itemTotal
		orderItems = append(orderItems, models.OrderItem{
			ProductID: product.ID,
			Quantity:  item.Quantity,
			Price:     product.Price,
		})
		database.DB.Model(&product).Update("stock", product.Stock-item.Quantity)
	}

	order := models.Order{
		UserID:     uid,
		Status:     "pending",
		TotalPrice: totalPrice,
		Items:      orderItems,
	}

	if err := database.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	go notification.SendOrderEvent(order.ID, uid, totalPrice)

	c.JSON(http.StatusCreated, order)
}

func GetMyOrders(c *gin.Context) {
	uid := getUserIDFromContext(c)
	var orders []models.Order
	database.DB.Preload("Items").Where("user_id = ?", uid).Order("created_at DESC").Find(&orders)

	for i := range orders {
		for j := range orders[i].Items {
			var product models.Product
			database.DB.Select("name, image_url").First(&product, orders[i].Items[j].ProductID)
			orders[i].Items[j].ProductName = product.Name
			orders[i].Items[j].ImageURL = product.ImageURL
		}
	}

	c.JSON(http.StatusOK, orders)
}

func GetOrderByID(c *gin.Context) {
	uid := getUserIDFromContext(c)
	var order models.Order
	if err := database.DB.Preload("Items").First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	if order.UserID != uid {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	c.JSON(http.StatusOK, order)
}

func UpdateOrderStatus(c *gin.Context) {
	var order models.Order
	if err := database.DB.First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	var input struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	allowed := map[string]bool{"pending": true, "paid": true, "shipped": true, "cancelled": true}
	if !allowed[input.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status. Use: pending, paid, shipped, cancelled"})
		return
	}

	database.DB.Model(&order).Update("status", input.Status)
	c.JSON(http.StatusOK, order)
}
