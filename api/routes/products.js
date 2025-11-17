const express = require('express');
const db = require('../db');
const router = express.Router();

// Helper function to format products
const formatProducts = (products, colors, images, sizes) => {
    const productMap = {};

    products.forEach(p => {
        productMap[p.id] = {
            id: p.id,
            name: p.name,
            description: p.description,
            price: parseFloat(p.price),
            originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
            subCategoryId: p.sub_category_id,
            isAvailable: p.is_available,
            isBestSeller: p.is_best_seller,
            isFeatured: p.is_featured,
            colorVariants: [],
            sizes: []
        };
    });

    const colorMap = {};
    colors.forEach(c => {
        if (productMap[c.product_id]) {
            const colorVariant = { id: c.id, name: c.name, colorCode: c.color_code, images: [] };
            colorMap[c.id] = colorVariant;
            productMap[c.product_id].colorVariants.push(colorVariant);
        }
    });

    images.forEach(img => {
        if (colorMap[img.product_color_id]) {
            colorMap[img.product_color_id].images.push(img.image_url);
        }
    });
    
    sizes.forEach(s => {
        if (productMap[s.product_id]) {
            productMap[s.product_id].sizes.push(s.size_name);
        }
    });

    return Object.values(productMap);
};

// Get all products
router.get('/', async (req, res) => {
    try {
        const productsRes = await db.query('SELECT * FROM products ORDER BY id ASC');
        const colorsRes = await db.query('SELECT * FROM product_colors');
        const imagesRes = await db.query('SELECT * FROM product_color_images');
        const sizesRes = await db.query('SELECT * FROM product_sizes');

        const formatted = formatProducts(productsRes.rows, colorsRes.rows, imagesRes.rows, sizesRes.rows);
        res.json(formatted);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new product
router.post('/', async (req, res) => {
    const { name, description, price, originalPrice, subCategoryId, isAvailable, colorVariants, sizes, isBestSeller, isFeatured } = req.body;
    
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        const productQuery = 'INSERT INTO products (name, description, price, original_price, sub_category_id, is_available, is_best_seller, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
        const productValues = [name, description, price, originalPrice, subCategoryId, isAvailable, isBestSeller, isFeatured];
        const productResult = await client.query(productQuery, productValues);
        const productId = productResult.rows[0].id;

        for (const variant of colorVariants) {
            const colorQuery = 'INSERT INTO product_colors (product_id, name, color_code) VALUES ($1, $2, $3) RETURNING id';
            const colorResult = await client.query(colorQuery, [productId, variant.name, variant.colorCode]);
            const colorId = colorResult.rows[0].id;

            for (const imageUrl of variant.images) {
                const imageQuery = 'INSERT INTO product_color_images (product_color_id, image_url) VALUES ($1, $2)';
                await client.query(imageQuery, [colorId, imageUrl]);
            }
        }

        for (const size of sizes) {
            const sizeQuery = 'INSERT INTO product_sizes (product_id, size_name) VALUES ($1, $2)';
            await client.query(sizeQuery, [productId, size]);
        }

        await client.query('COMMIT');
        res.status(201).json({ id: productId, ...req.body });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});

// Update a product
router.put('/:id', async (req, res) => {
     const { id } = req.params;
    const { name, description, price, originalPrice, subCategoryId, isAvailable, colorVariants, sizes, isBestSeller, isFeatured } = req.body;

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        
        // Update product table
        await client.query(
            'UPDATE products SET name=$1, description=$2, price=$3, original_price=$4, sub_category_id=$5, is_available=$6, is_best_seller=$7, is_featured=$8, updated_at=NOW() WHERE id=$9',
            [name, description, price, originalPrice, subCategoryId, isAvailable, isBestSeller, isFeatured, id]
        );

        // Clear old variants and sizes
        await client.query('DELETE FROM product_colors WHERE product_id = $1', [id]);
        await client.query('DELETE FROM product_sizes WHERE product_id = $1', [id]);
        // Deleting from product_colors will cascade and delete from product_color_images

        // Insert new variants
        for (const variant of colorVariants) {
            const colorQuery = 'INSERT INTO product_colors (product_id, name, color_code) VALUES ($1, $2, $3) RETURNING id';
            const colorResult = await client.query(colorQuery, [id, variant.name, variant.colorCode]);
            const colorId = colorResult.rows[0].id;

            for (const imageUrl of variant.images) {
                const imageQuery = 'INSERT INTO product_color_images (product_color_id, image_url) VALUES ($1, $2)';
                await client.query(imageQuery, [colorId, imageUrl]);
            }
        }

        // Insert new sizes
        for (const size of sizes) {
            const sizeQuery = 'INSERT INTO product_sizes (product_id, size_name) VALUES ($1, $2)';
            await client.query(sizeQuery, [id, size]);
        }

        await client.query('COMMIT');
        res.status(200).json({ id, ...req.body });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});


// Delete a product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM products WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
