CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status            order_status NOT NULL DEFAULT 'pending',
  subtotal          NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax               NUMERIC(10, 2) NOT NULL CHECK (tax >= 0),
  shipping_cost     NUMERIC(10, 2) NOT NULL CHECK (shipping_cost >= 0),
  total             NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  shipping_address  JSONB NOT NULL,
  payment_intent_id VARCHAR(255),
  payment_status    payment_status NOT NULL DEFAULT 'pending',
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders (payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
