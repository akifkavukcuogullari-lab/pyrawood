CREATE TABLE IF NOT EXISTS products (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) NOT NULL UNIQUE,
  description      TEXT,
  price            NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  stock            INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku              VARCHAR(100) UNIQUE,
  weight           NUMERIC(10, 3),
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search ON products
  USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
