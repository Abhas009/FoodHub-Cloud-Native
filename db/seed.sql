
-- db/seed.sql
INSERT INTO restaurants (name, cuisine, rating, image_url) VALUES
('Bombay Bites', 'Indian', 4.6, '/images/restaurants/bombay-bites.jpg'),
('Sushi Street', 'Japanese', 4.5, '/images/restaurants/sushi-street.jpg'),
('Pasta Piazza', 'Italian', 4.4, '/images/restaurants/pasta-piazza.jpg'),
('Green Bowl', 'Healthy', 4.3, '/images/restaurants/green-bowl.jpg'),
('Burger Barn', 'American', 4.2, '/images/restaurants/burger-barn.jpg'),
('Taco Town', 'Mexican', 4.3, '/images/restaurants/taco-town.jpg'),
('Noodle Nook', 'Chinese', 4.4, '/images/restaurants/noodle-nook.jpg'),
('Bake & Brew', 'Cafe', 4.5, '/images/restaurants/bake-brew.jpg'),
('Shawarma Shack', 'Middle Eastern', 4.2, '/images/restaurants/shawarma-shack.jpg'),
('Veggie Valley', 'Vegetarian', 4.7, '/images/restaurants/veggie-valley.jpg');

WITH r AS (SELECT id FROM restaurants)
INSERT INTO menu_items (restaurant_id, name, price_cents, image_url, is_veg)
SELECT id, 'Signature Dish ' || id, 29900, '/images/food/default.jpg', (id % 2 = 0) FROM r
UNION ALL
SELECT id, 'Combo Meal ' || id, 19900, '/images/food/default.jpg', TRUE FROM r
UNION ALL
SELECT id, 'Dessert ' || id, 9900, '/images/food/default.jpg', TRUE FROM r;
