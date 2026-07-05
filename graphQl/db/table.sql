-- ============================================================
-- E-Commerce PostgreSQL Schema + Seed Data
-- ============================================================

BEGIN;

-- Drop tables if they exist (in dependency order)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- SCHEMA
-- ============================================================

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50) UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    phone         VARCHAR(20),
    address       TEXT,
    city          VARCHAR(100),
    country       VARCHAR(100),
    role          VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'seller')),
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) UNIQUE NOT NULL,
    description   TEXT,
    price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_price NUMERIC(10, 2) CHECK (compare_price >= 0),
    sku           VARCHAR(100) UNIQUE NOT NULL,
    stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    seller_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active     BOOLEAN DEFAULT TRUE,
    weight_kg     NUMERIC(6, 2),
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status           VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    total_amount     NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address TEXT NOT NULL,
    shipping_city    VARCHAR(100) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,
    payment_method   VARCHAR(50) NOT NULL,
    payment_status   VARCHAR(30) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
    tracking_number  VARCHAR(100),
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE TABLE reviews (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title      VARCHAR(200),
    body       TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- Indexes for common queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Users (10 users: 1 admin, 2 sellers, 7 customers)
INSERT INTO users (username, email, password_hash, first_name, last_name, phone, address, city, country, role) VALUES
('admin_sarah',    'sarah.admin@shopify.test',    '$2b$12$LJ3m4ys2Kqf.HpXsGxKwAeVkF8QRmRdGH0n3K1YvC8B2sE.Oa5pq', 'Sarah',    'Mitchell',   '+1-555-0101', '742 Evergreen Terrace',       'New York',      'United States', 'admin'),
('seller_techzone','techzone@vendors.test',        '$2b$12$Xk9Vq3LpN.Rm2sT8W5yFhOzJc4dP6eBf1nA7gK0iU3wY9xHvQjZS', 'Marcus',   'Chen',       '+1-555-0102', '88 Silicon Ave',             'San Francisco', 'United States', 'seller'),
('seller_stylehaus','stylehaus@vendors.test',      '$2b$12$Ap3Bn7Gk.Ws1qR6fJ4yEiOzHm8xT5dCv0nL2sK9uF3wY7pQjXeN', 'Amara',    'Okafor',     '+44-20-7946-0958', '15 Oxford Street',      'London',        'United Kingdom', 'seller'),
('john_doe',       'john.doe@email.test',          '$2b$12$Hk4Lm9Rp.Zt3wE6gN8yBjOxFn2sA5dCv0qK7iU1fW3xY9pHjQeS', 'John',     'Doe',        '+1-555-0201', '123 Main St',                'Chicago',       'United States', 'customer'),
('emma_wilson',    'emma.w@email.test',            '$2b$12$Tn8Kp3Lq.Wx5rE2gJ6yAmOzHf4sB7dCn0vK1iU9wF3xY8pQjZeS', 'Emma',     'Wilson',     '+1-555-0202', '456 Oak Ave',                'Austin',        'United States', 'customer'),
('liam_murphy',    'liam.m@email.test',            '$2b$12$Qr5Jn7Gk.Vs9wT4fH2yDiOxLm6sC8dBp0nK3iU1eW5xY7pRjXeS', 'Liam',     'Murphy',     '+353-1-234-5678', '78 Grafton St',          'Dublin',        'Ireland',       'customer'),
('yuki_tanaka',    'yuki.t@email.test',            '$2b$12$Mp2Fn8Hk.Ut7wR6gK4yBjOzNl3sA9dCv0qL5iU1fW8xY6pTjQeS', 'Yuki',     'Tanaka',     '+81-3-1234-5678', '2-1 Shibuya',            'Tokyo',         'Japan',         'customer'),
('carlos_rivera',  'carlos.r@email.test',          '$2b$12$Ws6Gn4Lp.Rq1wE8fJ3yAmOxHk9sB5dCv0nK7iU2eW4xY1pQjZeS', 'Carlos',   'Rivera',     '+52-55-1234-5678', 'Av. Reforma 222',       'Mexico City',   'Mexico',        'customer'),
('priya_sharma',   'priya.s@email.test',           '$2b$12$Xt9Hp5Mk.Sq3wR7gL6yBiOzJn1sC4dAv0qK8iU2fW6xY3pUjXeS', 'Priya',    'Sharma',     '+91-11-2345-6789', '45 MG Road',            'Mumbai',        'India',         'customer'),
('felix_berg',     'felix.b@email.test',           '$2b$12$Zu1Ip6Nk.Tr4wS8hM7yClOxKo2sD5eBv0qL9iU3gW7xY4pVjQeS', 'Felix',    'Berg',       '+49-30-1234-5678', 'Friedrichstr. 101',     'Berlin',        'Germany',       'customer');

-- Categories (8 categories with hierarchy)
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Electronics',       'electronics',        'Electronic devices and gadgets',                   NULL),
('Clothing',          'clothing',           'Fashion and apparel',                              NULL),
('Home & Garden',     'home-garden',        'Everything for your home',                         NULL),
('Smartphones',       'smartphones',        'Mobile phones and accessories',                    1),
('Laptops',           'laptops',            'Notebooks and laptop accessories',                 1),
('Men''s Clothing',   'mens-clothing',      'Clothing for men',                                 2),
('Women''s Clothing', 'womens-clothing',    'Clothing for women',                               2),
('Kitchen',           'kitchen',            'Kitchen appliances and tools',                     3);

-- Products (15 products across categories)
INSERT INTO products (name, slug, description, price, compare_price, sku, stock, category_id, seller_id, is_active, weight_kg) VALUES
('iPhone 15 Pro Max',         'iphone-15-pro-max',         'Latest Apple flagship with A17 Pro chip, 256GB',                        1199.99, 1299.99, 'TECH-IPH15PM-256',  45,  4, 2, TRUE,  0.22),
('Samsung Galaxy S24 Ultra',  'samsung-galaxy-s24-ultra',  'Samsung premium phone with S Pen, 512GB',                               1099.99, NULL,    'TECH-SGS24U-512',   30,  4, 2, TRUE,  0.23),
('MacBook Pro 16" M3 Max',    'macbook-pro-16-m3-max',     'Apple MacBook Pro with M3 Max chip, 36GB RAM, 1TB SSD',                 3499.00, 3699.00, 'TECH-MBP16M3-1TB',  12,  5, 2, TRUE,  2.14),
('ThinkPad X1 Carbon Gen 11', 'thinkpad-x1-carbon-gen11',  'Lenovo business ultrabook, i7, 16GB RAM, 512GB SSD',                   1649.00, 1899.00, 'TECH-TPX1C11-512',  20,  5, 2, TRUE,  1.12),
('Sony WH-1000XM5',           'sony-wh-1000xm5',          'Industry-leading noise canceling wireless headphones',                    348.00, 399.99,  'TECH-SNYXM5-BLK',  65,  1, 2, TRUE,  0.25),
('Slim Fit Oxford Shirt',     'slim-fit-oxford-shirt',     'Classic cotton oxford button-down, available in white and blue',           79.99, NULL,    'STY-OXSH-SLM-M',  120,  6, 3, TRUE,  0.30),
('Wool Blend Overcoat',       'wool-blend-overcoat',       'Premium Italian wool blend, double-breasted overcoat',                   349.99, 429.99,  'STY-WOOC-DBL-L',   25,  6, 3, TRUE,  1.80),
('High-Waist Wide Leg Pants', 'high-waist-wide-leg-pants', 'Elegant wide-leg trousers in breathable linen blend',                   119.99, NULL,    'STY-HWWL-LIN-S',   55,  7, 3, TRUE,  0.45),
('Cashmere V-Neck Sweater',   'cashmere-v-neck-sweater',   '100% Mongolian cashmere, ribbed trim, relaxed fit',                     229.99, 299.99,  'STY-CASH-VNK-M',   35,  7, 3, TRUE,  0.35),
('Floral Midi Dress',         'floral-midi-dress',         'Vintage-inspired floral print midi dress with puff sleeves',              89.99, NULL,    'STY-FLMD-PFF-S',   70,  7, 3, TRUE,  0.40),
('KitchenAid Stand Mixer',    'kitchenaid-stand-mixer',    'Artisan series 5-quart tilt-head stand mixer, Empire Red',               449.99, 499.99,  'HOM-KASM-5QT-RED',  18,  8, 2, TRUE,  11.60),
('Instant Pot Duo 7-in-1',    'instant-pot-duo-7in1',      'Multi-use pressure cooker, slow cooker, rice cooker, 6 quart',           89.99, 119.99,  'HOM-IPDU-6QT',      40,  8, 2, TRUE,  5.40),
('Japanese Chef Knife 8"',    'japanese-chef-knife-8',     'Hand-forged Damascus steel gyuto knife, pakkawood handle',              189.00, NULL,    'HOM-JCKN-8IN',      22,  8, 2, TRUE,  0.28),
('Ceramic Plant Pot Set',     'ceramic-plant-pot-set',     'Set of 3 minimalist ceramic planters with drainage holes',               54.99, 69.99,   'HOM-CPPS-3PC',      60,  3, 3, TRUE,  3.20),
('Organic Cotton Throw',      'organic-cotton-throw',      'GOTS certified organic cotton throw blanket, 150x200cm',                 79.99, NULL,    'HOM-OCTH-150',      45,  3, 3, TRUE,  1.10);

-- Orders (12 orders with various statuses)
INSERT INTO orders (user_id, status, total_amount, shipping_address, shipping_city, shipping_country, payment_method, payment_status, tracking_number, notes, created_at) VALUES
(4, 'delivered',   1548.99, '123 Main St',                'Chicago',       'United States', 'credit_card',   'paid',     'USP-9382741056', NULL,                                      '2025-11-15 09:23:00'),
(4, 'shipped',      429.98, '123 Main St',                'Chicago',       'United States', 'paypal',        'paid',     'FDX-2847395016', NULL,                                      '2026-01-20 14:45:00'),
(5, 'delivered',    349.99, '456 Oak Ave',                'Austin',        'United States', 'credit_card',   'paid',     'USP-1029384756', NULL,                                      '2025-12-03 11:30:00'),
(5, 'processing',   269.98, '456 Oak Ave',                'Austin',        'United States', 'credit_card',   'paid',     NULL,             'Gift wrap please',                        '2026-03-10 08:15:00'),
(6, 'delivered',   3499.00, '78 Grafton St',              'Dublin',        'Ireland',       'credit_card',   'paid',     'DHL-8273649501', NULL,                                      '2025-10-22 16:00:00'),
(6, 'pending',      189.00, '78 Grafton St',              'Dublin',        'Ireland',       'bank_transfer', 'unpaid',   NULL,             NULL,                                      '2026-04-01 10:20:00'),
(7, 'confirmed',   1199.99, '2-1 Shibuya',               'Tokyo',         'Japan',         'credit_card',   'paid',     NULL,             'Please include original receipt',          '2026-03-28 22:10:00'),
(8, 'cancelled',    159.98, 'Av. Reforma 222',            'Mexico City',   'Mexico',        'paypal',        'refunded', NULL,             'Customer requested cancellation',          '2026-02-14 13:55:00'),
(9, 'delivered',    539.98, '45 MG Road',                 'Mumbai',        'India',         'credit_card',   'paid',     'DHL-5648392017', NULL,                                      '2025-12-18 07:40:00'),
(9, 'shipped',      449.99, '45 MG Road',                 'Mumbai',        'India',         'credit_card',   'paid',     'DHL-7382916450', 'Handle with care - fragile',              '2026-03-15 09:30:00'),
(10, 'delivered',   169.98, 'Friedrichstr. 101',          'Berlin',        'Germany',       'paypal',        'paid',     'DHL-3948271650', NULL,                                      '2026-01-05 18:25:00'),
(10, 'refunded',     89.99, 'Friedrichstr. 101',          'Berlin',        'Germany',       'credit_card',   'refunded', 'DHL-6172839405', 'Product arrived damaged',                  '2026-02-28 12:00:00');

-- Order Items (varying items per order)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
-- Order 1: iPhone + Sony headphones
(1,  1,  1, 1199.99),
(1,  5,  1,  348.00),
-- Order 2: Oxford shirt + Cashmere sweater
(2,  6,  2,   79.99),
(2,  9,  1,  229.99),
-- Order 3: Wool overcoat
(3,  7,  1,  349.99),
-- Order 4: Floral dress + Chef knife (gift)
(4, 10,  1,   89.99),
(4, 13,  1,  189.00),
-- Order 5: MacBook Pro
(5,  3,  1, 3499.00),
-- Order 6: Chef knife
(6, 13,  1,  189.00),
-- Order 7: iPhone 15 Pro Max
(7,  1,  1, 1199.99),
-- Order 8: Oxford shirt x2 (cancelled)
(8,  6,  2,   79.99),
-- Order 9: KitchenAid + Instant Pot
(9, 11,  1,  449.99),
(9, 12,  1,   89.99),
-- Order 10: KitchenAid
(10, 11, 1,  449.99),
-- Order 11: Floral dress + Organic throw
(11, 10, 1,   89.99),
(11, 15, 1,   79.99),
-- Order 12: Floral dress (refunded - damaged)
(12, 10, 1,   89.99);

-- Reviews (18 reviews across products)
INSERT INTO reviews (user_id, product_id, rating, title, body, is_verified, created_at) VALUES
(4,  1, 5, 'Best phone I have ever owned',        'The camera system is unreal. ProRes video is a game changer for my content creation workflow. Battery easily lasts a full day.',                           TRUE,  '2025-12-01 10:00:00'),
(7,  1, 4, 'Great but pricey',                     'Amazing device with incredible performance. Only dock a star because the price is hard to justify over the regular Pro.',                               TRUE,  '2026-04-02 15:30:00'),
(5,  2, 5, 'S Pen makes all the difference',       'Coming from a Note user, the S24 Ultra is the perfect evolution. The AI features are surprisingly useful day to day.',                                  TRUE,  '2025-12-20 09:15:00'),
(6,  3, 5, 'Absolute powerhouse',                  'Compiles my entire Rust project in under 2 minutes. The screen is gorgeous and the speakers are the best on any laptop. Worth every penny.',            TRUE,  '2025-11-10 14:20:00'),
(9,  3, 4, 'Almost perfect',                       'Incredible performance and build quality. The notch is still slightly annoying for fullscreen work, but that''s my only complaint.',                    TRUE,  '2026-01-08 11:45:00'),
(4,  5, 5, 'Silence is golden',                    'The noise cancellation is a quantum leap from the XM4. I wear these 8+ hours a day in an open office and forget I have them on.',                      TRUE,  '2025-12-05 16:30:00'),
(8,  5, 3, 'Good but not comfortable for me',      'Sound quality and ANC are top notch, but they press too hard on my ears after a couple hours. Your mileage may vary.',                                  TRUE,  '2026-03-01 08:00:00'),
(5,  7, 5, 'Stunning quality',                     'The wool feels incredibly luxurious. I got so many compliments wearing this to a holiday party. Runs slightly large - size down.',                      TRUE,  '2025-12-15 19:00:00'),
(6,  7, 4, 'Beautiful but needs tailoring',         'Gorgeous coat, the Italian wool is clearly premium. Had to get the sleeves shortened but that''s expected for my frame.',                               FALSE, '2026-02-10 13:20:00'),
(10, 10, 4, 'Lovely summer dress',                  'The print is even more beautiful in person. Fabric is lightweight and breathable. Perfect for Berlin summers.',                                        TRUE,  '2026-01-20 10:30:00'),
(4,  9, 5, 'Softest sweater I own',                'This cashmere is butter-soft. Hand wash only is a bit annoying but the quality justifies the care. Bought a second in navy.',                           TRUE,  '2026-02-08 17:45:00'),
(9, 11, 5, 'Built like a tank',                    'This mixer handles everything I throw at it - bread dough, meringue, pasta. The Empire Red looks stunning on my counter. A forever kitchen appliance.', TRUE,  '2026-01-02 12:00:00'),
(10, 11, 4, 'Great mixer, loud though',             'Does everything beautifully but it''s quite loud on higher speeds, especially with bread dough. Quality is undeniable.',                                TRUE,  '2026-01-15 08:30:00'),
(9, 12, 4, 'Replaced three appliances',            'Sold my rice cooker, slow cooker, and steamer after getting this. The pressure cooking function alone is worth it. Saves so much counter space.',        TRUE,  '2026-01-05 14:10:00'),
(5, 13, 5, 'A work of art',                        'The Damascus pattern is beautiful and the edge retention is remarkable. Cuts through everything like butter. Best knife I have ever used.',              FALSE, '2026-03-20 09:45:00'),
(6, 13, 4, 'Excellent knife, handle could be better','The blade is superb - razor sharp out of the box. I find the pakkawood handle a bit slippery when wet though. Still highly recommend.',                FALSE, '2026-04-03 11:00:00'),
(8, 14, 5, 'Minimalist perfection',                'These pots look exactly like the photos. Good drainage, clean lines. The matte finish picks up fewer water stains than glazed alternatives.',            TRUE,  '2026-03-05 16:15:00'),
(10, 15, 4, 'Cozy and ethical',                     'Love that it''s organic cotton. Very soft and the perfect weight for spring/autumn evenings. Washes well too - no shrinkage after 5 washes.',           TRUE,  '2026-01-25 20:00:00');

COMMIT;
