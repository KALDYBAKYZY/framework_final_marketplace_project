package handlers

import (
	"backend/internal/database"
	"backend/internal/models"
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)

	host := "localhost"
	if h := os.Getenv("DB_HOST"); h != "" {
		host = h
	}
	port := "5433"
	if p := os.Getenv("DB_PORT"); p != "" {
		port = p
	}

	dsn := "host=" + host + " user=postgres password=12345678 dbname=marketplace port=" + port + " sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println("Test DB not available, skipping:", err)
		os.Exit(0)
	}

	db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Product{},
		&models.Order{},
		&models.OrderItem{},
		&models.Review{},
	)

	database.DB = db

	code := m.Run()

	db.Exec("DELETE FROM reviews")
	db.Exec("DELETE FROM order_items")
	db.Exec("DELETE FROM orders")
	db.Exec("DELETE FROM products WHERE name LIKE 'test_%'")
	db.Exec("DELETE FROM categories WHERE name LIKE 'test_%'")
	db.Exec("DELETE FROM users WHERE email LIKE 'test_%'")

	os.Exit(code)
}

func makeRouter() *gin.Engine {
	r := gin.New()
	return r
}

func toJSON(v interface{}) *bytes.Buffer {
	b, _ := json.Marshal(v)
	return bytes.NewBuffer(b)
}

func TestRegister_Success(t *testing.T) {
	r := makeRouter()
	r.POST("/register", Register)

	body := toJSON(map[string]string{
		"name":     "Test User",
		"email":    "test_register@example.com",
		"password": "password123",
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/register", body)
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestRegister_DuplicateEmail(t *testing.T) {
	r := makeRouter()
	r.POST("/register", Register)

	body := toJSON(map[string]string{
		"name":     "Test User",
		"email":    "test_duplicate@example.com",
		"password": "password123",
	})
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/register", body)
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	w2 := httptest.NewRecorder()
	req2, _ := http.NewRequest("POST", "/register", toJSON(map[string]string{
		"name":     "Test User",
		"email":    "test_duplicate@example.com",
		"password": "password123",
	}))
	req2.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w2, req2)

	assert.Equal(t, http.StatusConflict, w2.Code)
}

func TestLogin_Success(t *testing.T) {
	r := makeRouter()
	r.POST("/register", Register)
	r.POST("/login", Login)

	r.ServeHTTP(httptest.NewRecorder(), func() *http.Request {
		req, _ := http.NewRequest("POST", "/register", toJSON(map[string]string{
			"name": "Login Test", "email": "test_login@example.com", "password": "pass123",
		}))
		req.Header.Set("Content-Type", "application/json")
		return req
	}())

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/login", toJSON(map[string]string{
		"email": "test_login@example.com", "password": "pass123",
	}))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NotEmpty(t, resp["token"])
}

func TestLogin_WrongPassword(t *testing.T) {
	r := makeRouter()
	r.POST("/login", Login)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/login", toJSON(map[string]string{
		"email":    "nonexistent_user_xyz@example.com",
		"password": "wrongpassword",
	}))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestGetProducts_Success(t *testing.T) {
	r := makeRouter()
	r.GET("/products", GetProducts)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/products", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetProducts_WithSearch(t *testing.T) {
	r := makeRouter()
	r.GET("/products", GetProducts)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/products?search=test", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetProduct_NotFound(t *testing.T) {
	r := makeRouter()
	r.GET("/products/:id", GetProduct)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/products/999999", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestCreateProduct_NoAuth(t *testing.T) {
	r := makeRouter()
	r.POST("/products", CreateProduct)

	var cat models.Category
	database.DB.Where("name = ?", "test_cat").FirstOrCreate(&cat, models.Category{Name: "test_cat"})

	body := toJSON(map[string]interface{}{
		"name":        "test_product_noauth",
		"price":       100.0,
		"stock":       5,
		"category_id": cat.ID,
	})
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/products", body)
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestGetCategories_Success(t *testing.T) {
	r := makeRouter()
	r.GET("/categories", GetCategories)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/categories", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestDeleteProduct_NotFound(t *testing.T) {
	r := makeRouter()
	r.DELETE("/products/:id", func(c *gin.Context) {
		c.Set("user_id", float64(1))
		DeleteProduct(c)
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/products/999999", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestCreateOrder_EmptyItems(t *testing.T) {
	r := makeRouter()
	r.POST("/orders", func(c *gin.Context) {
		c.Set("user_id", float64(1))
		CreateOrder(c)
	})

	body := toJSON(map[string]interface{}{"items": []interface{}{}})
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/orders", body)
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
