package models

type OrderItem struct {
	ID          uint    `gorm:"primaryKey" json:"id"`
	OrderID     uint    `json:"order_id"`
	ProductID   uint    `json:"product_id"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	ProductName string  `gorm:"-" json:"product_name"`
	ImageURL    string  `gorm:"-" json:"image_url"`
}
