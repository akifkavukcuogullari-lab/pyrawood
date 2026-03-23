-- Additional indexes for admin queries and performance

-- Orders: status filtering for admin dashboard
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- Orders: created_at for sorting and date-range queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

-- Orders: payment_status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status);

-- Products: active status filtering for admin vs public queries
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);

-- Products: created_at for sorting
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

-- Users: role filtering for admin user list
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- Reviews: created_at for sorting
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);
