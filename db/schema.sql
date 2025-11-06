
-- db/schema.sql
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS restaurants;
DROP TYPE IF EXISTS order_status;

CREATE TYPE order_status AS ENUM (
  'PLACED','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'
);

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 4.2,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_cents INT NOT NULL CHECK (price_cents > 0),
  image_url TEXT,
  is_veg BOOLEAN DEFAULT FALSE
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id INT NOT NULL REFERENCES restaurants(id),
  customer_name TEXT,
  customer_phone TEXT,
  address_line TEXT,
  total_cents INT NOT NULL,
  payment_intent TEXT,
  status order_status NOT NULL DEFAULT 'PLACED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_restaurant_created ON orders(restaurant_id, created_at DESC);
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);

CREATE TABLE order_items (
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INT REFERENCES menu_items(id),
  qty INT NOT NULL CHECK (qty > 0),
  price_cents INT NOT NULL,
  PRIMARY KEY(order_id, menu_item_id)
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
