package models

import "time"

type Product struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"unique" json:"name"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	Stock       int       `json:"stock"`
	Status      string    `gorm:"default:active" json:"status"`
	CategoryID  uint      `json:"category_id"`
	UserID      uint      `json:"user_id"`
	ImageURL    string    `json:"image_url"`
	SellerName  string    `gorm:"-" json:"seller_name"`
	CreatedAt   time.Time `json:"created_at"`
}
