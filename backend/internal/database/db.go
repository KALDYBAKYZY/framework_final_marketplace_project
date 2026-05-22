package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func getEnv(key string, fallback string) string {
	val := os.Getenv(key)
	if val == "" {
		return fallback
	}
	return val
}

func Connect() {
	host := getEnv("DB_HOST", "localhost")
	user := getEnv("DB_USER", "postgres")
	password := getEnv("DB_PASSWORD", "12345678")
	dbname := getEnv("DB_NAME", "marketplace1")
	port := getEnv("DB_PORT", "5433")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	//db.AutoMigrate(
	//	&models.User{},
	//	&models.Category{},
	//	&models.Product{},
	//	&models.Order{},
	//	&models.OrderItem{},
	//	&models.Review{},
	//)

	DB = db
	fmt.Println("Database connected and migrated successfully")
}
