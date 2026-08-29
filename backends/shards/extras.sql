alter table orders attach partition orders_q1 for values from ("2026-01-01") to ("2026-12-31") 
