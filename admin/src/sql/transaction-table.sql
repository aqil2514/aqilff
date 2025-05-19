CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  transaction_code VARCHAR(50) NOT NULL UNIQUE,
  total_amount NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_items (
  id SERIAL PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  price_per_unit NUMERIC(12, 2) NOT NULL,
  product_unit VARCHAR(20),
  discount NUMERIC(12, 2),
  tip NUMERIC(12, 2),
  product_sku VARCHAR(50),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(12, 2) NOT NULL
);
