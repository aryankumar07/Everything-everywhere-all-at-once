-- sample data for the e-commerce schema
-- run AFTER scheme.sql

-- uncomment to start from a clean slate (destroys all rows, resets id counters)
-- TRUNCATE order_items, orders, products, users RESTART IDENTITY CASCADE;

BEGIN;

-- password_hash values are placeholders - real ones come from bcrypt/argon2 in the app
INSERT INTO users (email, password_hash, name) VALUES
  ('aarav@example.com', '$2b$12$placeholderhashaarav000000000000000000000000000000000', 'Aarav Sharma'),
  ('meera@example.com', '$2b$12$placeholderhashmeera000000000000000000000000000000000', 'Meera Iyer'),
  ('dev@example.com',   '$2b$12$placeholderhashdev00000000000000000000000000000000000', 'Dev Patel')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (sku, name, description, price_cents, stock) VALUES
  ('TSHIRT-BLK-M', 'Black T-Shirt (M)',  'Cotton crew neck',        49900,  120),
  ('TSHIRT-BLK-L', 'Black T-Shirt (L)',  'Cotton crew neck',        49900,   80),
  ('MUG-CER-01',   'Ceramic Mug',        '350ml, dishwasher safe',  29900,  200),
  ('NOTEBOOK-A5',  'A5 Notebook',        'Dotted, 160 pages',       19900,  340),
  ('CABLE-USBC-2M','USB-C Cable 2m',     'Braided, 100W',           89900,   45)
ON CONFLICT (sku) DO NOTHING;

-- ids are GENERATED ALWAYS, so we never write them by hand.
-- look rows up by their natural keys (email, sku) and let the CTE hand the
-- new order id straight to the line items.
WITH new_order AS (
  INSERT INTO orders (user_id, status, total_cents)
  SELECT u.id, 'paid'::order_status, 0
  FROM users u
  WHERE u.email = 'aarav@example.com'
  RETURNING id
)
INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
SELECT o.id, p.id, v.qty, p.price_cents
FROM new_order o
CROSS JOIN (VALUES ('TSHIRT-BLK-M', 2), ('MUG-CER-01', 1)) AS v(sku, qty)
JOIN products p ON p.sku = v.sku;

WITH new_order AS (
  INSERT INTO orders (user_id, status, total_cents)
  SELECT u.id, 'pending'::order_status, 0
  FROM users u
  WHERE u.email = 'meera@example.com'
  RETURNING id
)
INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
SELECT o.id, p.id, v.qty, p.price_cents
FROM new_order o
CROSS JOIN (VALUES ('NOTEBOOK-A5', 3), ('CABLE-USBC-2M', 1)) AS v(sku, qty)
JOIN products p ON p.sku = v.sku;

-- totals are derived from the line items rather than typed in, so they can't drift
UPDATE orders o
SET total_cents = s.total
FROM (
  SELECT order_id, SUM(quantity * unit_price_cents) AS total
  FROM order_items
  GROUP BY order_id
) s
WHERE o.id = s.order_id;

COMMIT;
