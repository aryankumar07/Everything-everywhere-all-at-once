-- bulk sample data for the e-commerce schema
-- run AFTER scheme.sql. safe to run alongside seed.sql (natural keys collide harmlessly).
--
-- 60 users, 24 products, 500 orders with 1-4 line items each.
--
-- uncomment to start from a clean slate (destroys all rows, resets id counters)
-- TRUNCATE order_items, orders, products, users RESTART IDENTITY CASCADE;

BEGIN;

-- setseed makes every random() below reproducible: the same file always
-- produces the same 500 orders, so bug reports stay comparable.
SELECT setseed(0.42);

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
-- 20 first names x 3 surnames = 60 unique people.
-- password_hash values are placeholders - real ones come from bcrypt/argon2 in the app
INSERT INTO users (email, password_hash, name)
SELECT
  lower(n.first || '.' || n.last) || '@example.com',
  rpad('$2b$12$placeholderhash' || g, 60, '0'),
  n.first || ' ' || n.last
FROM generate_series(1, 60) AS g
CROSS JOIN LATERAL (
  SELECT
    (ARRAY['Aarav','Meera','Dev','Ishaan','Ananya','Kabir','Riya','Arjun',
           'Saanvi','Vihaan','Diya','Rohan','Naina','Aditya','Tara','Yash',
           'Kiara','Nikhil','Priya','Manav'])[(g - 1) % 20 + 1] AS first,
    (ARRAY['Sharma','Iyer','Patel'])[(g - 1) / 20 + 1]         AS last
) n
ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
-- the first five match seed.sql, so running both files leaves one copy of each.
-- stock is set high on purpose: nothing here decrements it, same as seed.sql.
INSERT INTO products (sku, name, description, price_cents, stock) VALUES
  ('TSHIRT-BLK-M',  'Black T-Shirt (M)',   'Cotton crew neck',           49900, 1200),
  ('TSHIRT-BLK-L',  'Black T-Shirt (L)',   'Cotton crew neck',           49900,  800),
  ('MUG-CER-01',    'Ceramic Mug',         '350ml, dishwasher safe',     29900, 2000),
  ('NOTEBOOK-A5',   'A5 Notebook',         'Dotted, 160 pages',          19900, 3400),
  ('CABLE-USBC-2M', 'USB-C Cable 2m',      'Braided, 100W',              89900,  450),
  ('TSHIRT-WHT-M',  'White T-Shirt (M)',   'Cotton crew neck',           49900,  900),
  ('TSHIRT-WHT-L',  'White T-Shirt (L)',   'Cotton crew neck',           49900,  760),
  ('HOODIE-GRY-M',  'Grey Hoodie (M)',     'Fleece lined, kangaroo pocket', 189900, 300),
  ('HOODIE-GRY-L',  'Grey Hoodie (L)',     'Fleece lined, kangaroo pocket', 189900, 280),
  ('CAP-NVY-01',    'Navy Cap',            'Adjustable strap',           59900,  640),
  ('SOCKS-PK3',     'Ankle Socks (3 pack)','Combed cotton',              39900, 1500),
  ('TOTE-CAN-01',   'Canvas Tote',         '12oz canvas, inner pocket',  69900,  520),
  ('BOTTLE-STL-750','Steel Bottle 750ml',  'Double walled, 24h cold',   129900,  410),
  ('MUG-TRV-01',    'Travel Mug',          '400ml, leak proof lid',      89900,  330),
  ('NOTEBOOK-A4',   'A4 Notebook',         'Ruled, 200 pages',           29900, 1100),
  ('PEN-GEL-PK5',   'Gel Pens (5 pack)',   '0.5mm, black ink',           24900, 2400),
  ('STICKER-PK10',  'Sticker Pack',        '10 vinyl stickers',           9900, 3000),
  ('POSTER-A2',     'A2 Poster',           'Matte, 200gsm',              39900,  700),
  ('CABLE-USBC-1M', 'USB-C Cable 1m',      'Braided, 100W',              59900,  880),
  ('CHARGER-65W',   '65W GaN Charger',     'Dual port, foldable pins',  249900,  260),
  ('POWERBANK-10K', 'Power Bank 10000mAh', 'USB-C PD, 20W',             199900,  190),
  ('MOUSEPAD-XL',   'XL Mousepad',         '900x400mm, stitched edges',  79900,  430),
  ('KEYCAPS-PBT',   'PBT Keycap Set',      'Dye sublimated, 129 keys',   349900,  120),
  ('LAPTOP-SLV-14', 'Laptop Sleeve 14"',   'Neoprene, water resistant',  109900,  350)
ON CONFLICT (sku) DO NOTHING;

-- ---------------------------------------------------------------------------
-- orders + order_items
-- ---------------------------------------------------------------------------
-- one order per iteration. the line items are staged in a temp table first so
-- the order can be inserted with its real total_cents already filled in -
-- an UPDATE afterwards would fire orders_updated_at and stamp every row with
-- now(), wiping out the backdated timestamps below.
CREATE TEMP TABLE seed_lines (
  product_id       BIGINT,
  quantity         INTEGER,
  unit_price_cents INTEGER
) ON COMMIT DROP;

DO $$
DECLARE
  v_order_id BIGINT;
  v_user_id  BIGINT;
  v_created  TIMESTAMPTZ;
  v_age_days NUMERIC;
  v_status   order_status;
  v_updated  TIMESTAMPTZ;
  v_total    INTEGER;
  v_roll     NUMERIC;
BEGIN
  FOR i IN 1..500 LOOP
    -- 2% of orders have no owner: the account was deleted and
    -- orders.user_id ON DELETE SET NULL kept the sale on the books.
    SELECT id INTO v_user_id
    FROM users
    ORDER BY random()
    LIMIT 1;

    IF random() < 0.02 THEN
      v_user_id := NULL;
    END IF;

    -- spread over the last 180 days
    v_created  := now() - (random() * 180) * INTERVAL '1 day';
    v_age_days := EXTRACT(EPOCH FROM (now() - v_created)) / 86400;
    v_roll     := random();

    -- status follows the order's age: fresh orders are still in flight,
    -- old ones have landed one way or the other.
    IF v_age_days < 3 THEN
      v_status := CASE WHEN v_roll < 0.55 THEN 'pending' ELSE 'paid' END;
    ELSIF v_age_days < 10 THEN
      v_status := CASE WHEN v_roll < 0.25 THEN 'paid'
                       WHEN v_roll < 0.90 THEN 'shipped'
                       ELSE 'cancelled' END;
    ELSE
      v_status := CASE WHEN v_roll < 0.80 THEN 'delivered'
                       WHEN v_roll < 0.92 THEN 'shipped'
                       ELSE 'cancelled' END;
    END IF;

    v_updated := CASE v_status
      WHEN 'pending'   THEN v_created
      WHEN 'paid'      THEN v_created + (random() *  6) * INTERVAL '1 hour'
      WHEN 'cancelled' THEN v_created + (random() *  2) * INTERVAL '1 day'
      WHEN 'shipped'   THEN v_created + (2 + random() * 2) * INTERVAL '1 day'
      ELSE                  v_created + (4 + random() * 5) * INTERVAL '1 day'
    END;

    -- 1-4 distinct products. ORDER BY random() LIMIT n can't repeat a row,
    -- which is what keeps UNIQUE (order_id, product_id) happy.
    DELETE FROM seed_lines;
    INSERT INTO seed_lines (product_id, quantity, unit_price_cents)
    SELECT
      p.id,
      1 + floor(random() * 3)::int,
      -- price is copied at purchase time, so orders older than 90 days sit at
      -- the pre-increase price rather than tracking products.price_cents.
      CASE WHEN v_age_days > 90
           THEN round(p.price_cents * 0.90)::int
           ELSE p.price_cents END
    FROM products p
    WHERE p.is_active
    ORDER BY random()
    LIMIT 1 + floor(random() * 4)::int;

    SELECT SUM(quantity * unit_price_cents) INTO v_total FROM seed_lines;

    INSERT INTO orders (user_id, status, total_cents, created_at, updated_at)
    VALUES (v_user_id, v_status, v_total, v_created, v_updated)
    RETURNING id INTO v_order_id;

    INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
    SELECT v_order_id, product_id, quantity, unit_price_cents FROM seed_lines;
  END LOOP;
END $$;

COMMIT;
