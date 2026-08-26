-- minimal e-commerce schema (postgres)
-- users -> orders -> order_items -> products

BEGIN;

CREATE TABLE users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  name          TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- price in the smallest currency unit (paise/cents) so we never do float math
CREATE TABLE products (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku           TEXT        NOT NULL UNIQUE,
  name          TEXT        NOT NULL,
  description   TEXT,
  price_cents   INTEGER     NOT NULL CHECK (price_cents >= 0),
  stock         INTEGER     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

CREATE TABLE orders (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- keep the order row if the account goes away; the history still matters
  user_id       BIGINT       REFERENCES users (id) ON DELETE SET NULL,
  status        order_status NOT NULL DEFAULT 'pending',
  -- denormalised sum of the line items, written when the order is placed
  total_cents   INTEGER      NOT NULL CHECK (total_cents >= 0),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id         BIGINT  NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  -- RESTRICT: a product that has been ordered can be deactivated, not deleted
  product_id       BIGINT  NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
  quantity         INTEGER NOT NULL CHECK (quantity > 0),
  -- price copied at purchase time; products.price_cents can change later
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  UNIQUE (order_id, product_id)
);

CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
