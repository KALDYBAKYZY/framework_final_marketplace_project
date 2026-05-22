CREATE TABLE products (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR(255) UNIQUE NOT NULL,
                          description TEXT,
                          price DECIMAL(12,2) NOT NULL,
                          stock INT NOT NULL DEFAULT 0,
                          status VARCHAR(50) DEFAULT 'active',
                          category_id BIGINT NOT NULL,
                          user_id BIGINT DEFAULT 0,
                          image_url VARCHAR(500) DEFAULT '',
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_products_category
                              FOREIGN KEY (category_id)
                                  REFERENCES categories(id)
                                  ON DELETE CASCADE,
                          CONSTRAINT fk_products_user
                              FOREIGN KEY (user_id)
                                  REFERENCES users(id)
                                  ON DELETE CASCADE
);