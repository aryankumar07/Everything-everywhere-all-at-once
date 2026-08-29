begin;
  alter table orders rename to old_orders;

  create table orders (
    id          BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id     BIGINT REFERENCES users (id) ON DELETE SET NULL,
    status      order_status NOT NULL DEFAULT 'pending',
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id, created_at)
  ) PARTITION BY RANGE (created_at);

  create table orders_q1 partition of orders
    for values from ('2026-01-01') to ('2026-04-01');
  create table orders_q2 partition of orders
    for values from ('2026-04-01') to ('2026-07-01');
  create table orders_q3 partition of orders
    for values from ('2026-07-01') to ('2026-10-01');
  create table orders_q4 partition of orders
    for values from ('2026-10-01') to ('2027-01-01');

  insert into orders (id, user_id, status, total_cents, created_at, updated_at)
  overriding system value
  select id, user_id, status, total_cents, created_at, updated_at
  from old_orders;

  select setval(
    pg_get_serial_sequence('orders','id'),
    coalesce((select max(id) from orders), 1)
  );

  alter table order_items add column order_created_at TIMESTAMPTZ;

  update order_items oi
  set order_created_at = o.created_at
  from orders o
  where o.id = oi.order_id;

  alter table order_items
    alter column order_created_at set not null,
    drop constraint order_items_order_id_fkey,
    add constraint order_items_order_fkey
      foreign key (order_id, order_created_at)
      references orders (id, created_at)
      ON DELETE CASCADE;

  CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

  DROP TABLE old_orders;
commit;
