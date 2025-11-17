const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all products using an efficient single query
router.get('/', async (req, res) => {
    const query = `
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.original_price AS "originalPrice",
            p.sub_category_id AS "subCategoryId",
            p.is_available AS "isAvailable",
            p.is_best_seller AS "isBestSeller",
            p.is_featured AS "isFeatured",
            (
                SELECT COALESCE(json_agg(s.size_name ORDER BY s.id), '[]'::json)
                FROM product_sizes s
                WHERE s.product_id = p.id
            ) AS sizes,
            (
                SELECT COALESCE(json_agg(
                    json_build_object(
                        'id', c.id,
                        'name', c.name,
                        'colorCode', c.color_code,
                        'images', (
                            SELECT COALESCE(json_agg(i.image_url ORDER BY i.id), '[]'::json)
                            FROM product_color_images i
                            WHERE i.product_color_id = c.id
                        )
                    ) ORDER BY c.id
                ), '[]'::json)
                FROM product_colors c
                WHERE c.product_id = p.id
            ) AS "colorVariants"
        FROM
            products p
        ORDER BY
            p.id ASC;
    `;
    try {
        const { rows } = await db.query(query);
        // Ensure price fields are numbers
        const products = rows.map(p => ({
            ...p,
            price: parseFloat(p.price),
            originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : undefined
        }));
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err.message);
        res.status(500).send('Server error');
    }
});


// Add a new product
router.post('/', async (req, res) => {
    const { name, description, price, originalPrice, subCategoryId, isAvailable, colorVariants, sizes, isBestSeller, isFeatured } = req.body;
    
    const client = await db.getPool().connect();
    try {
        await client.query('BEGIN');

        const productQuery = 'INSERT INTO products (name, description, price, original_price, sub_category_id, is_available, is_best_seller, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
        const productValues = [name, description, price, originalPrice, subCategoryId, isAvailable, isBestSeller, isFeatured];
        const productResult = await client.query(productQuery, productValues);
        const newProduct = productResult.rows[0];

        const insertedColorVariants = [];
        for (const variant of colorVariants) {
            const colorQuery = 'INSERT INTO product_colors (product_id, name, color_code) VALUES ($1, $2, $3) RETURNING id';
            const colorResult = await client.query(colorQuery, [newProduct.id, variant.name, variant.colorCode]);
            const colorId = colorResult.rows[0].id;

            const insertedImages = [];
            for (const imageUrl of variant.images) {
                const imageQuery = 'INSERT INTO product_color_images (product_color_id, image_url) VALUES ($1, $2) RETURNING image_url';
                const imageResult = await client.query(imageQuery, [colorId, imageUrl]);
                insertedImages.push(imageResult.rows[0].image_url);
            }
            insertedColorVariants.push({ ...variant, id: colorId, images: insertedImages });
        }

        const insertedSizes = [];
        for (const size of sizes) {
            const sizeQuery = 'INSERT INTO product_sizes (product_id, size_name) VALUES ($1, $2) RETURNING size_name';
            const sizeResult = await client.query(sizeQuery, [newProduct.id, size]);
            insertedSizes.push(sizeResult.rows[0].size_name);
        }

        await client.query('COMMIT');
        
        // Return the full product object as the frontend expects it
        res.status(201).json({
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            price: parseFloat(newProduct.price),
            originalPrice: newProduct.original_price ? parseFloat(newProduct.original_price) : undefined,
            subCategoryId: newProduct.sub_category_id,
            isAvailable: newProduct.is_available,
            isBestSeller: newProduct.is_best_seller,
            isFeatured: newProduct.is_featured,
            colorVariants: insertedColorVariants,
            sizes: insertedSizes
        });

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

    const client = await db.getPool().connect();
    try {
        await client.query('BEGIN');
        
        // Update product table
        const updatedProductResult = await client.query(
            'UPDATE products SET name=$1, description=$2, price=$3, original_price=$4, sub_category_id=$5, is_available=$6, is_best_seller=$7, is_featured=$8, updated_at=NOW() WHERE id=$9 RETURNING *',
            [name, description, price, originalPrice, subCategoryId, isAvailable, isBestSeller, isFeatured, id]
        );
        const updatedProduct = updatedProductResult.rows[0];

        // Clear old variants and sizes
        await client.query('DELETE FROM product_colors WHERE product_id = $1', [id]);
        await client.query('DELETE FROM product_sizes WHERE product_id = $1', [id]);
        // Deleting from product_colors will cascade and delete from product_color_images

        // Insert new variants
        const insertedColorVariants = [];
        for (const variant of colorVariants) {
            const colorQuery = 'INSERT INTO product_colors (product_id, name, color_code) VALUES ($1, $2, $3) RETURNING id';
            const colorResult = await client.query(colorQuery, [id, variant.name, variant.colorCode]);
            const colorId = colorResult.rows[0].id;

            const insertedImages = [];
            for (const imageUrl of variant.images) {
                const imageQuery = 'INSERT INTO product_color_images (product_color_id, image_url) VALUES ($1, $2) RETURNING image_url';
                const imageResult = await client.query(imageQuery, [colorId, imageUrl]);
                insertedImages.push(imageResult.rows[0].image_url);
            }
             insertedColorVariants.push({ ...variant, id: colorId, images: insertedImages });
        }

        // Insert new sizes
        const insertedSizes = [];
        for (const size of sizes) {
            const sizeQuery = 'INSERT INTO product_sizes (product_id, size_name) VALUES ($1, $2) RETURNING size_name';
            const sizeResult = await client.query(sizeQuery, [id, size]);
            insertedSizes.push(sizeResult.rows[0].size_name);
        }

        await client.query('COMMIT');
        
        res.status(200).json({
            id: updatedProduct.id,
            name: updatedProduct.name,
            description: updatedProduct.description,
            price: parseFloat(updatedProduct.price),
            originalPrice: updatedProduct.original_price ? parseFloat(updatedProduct.original_price) : undefined,
            subCategoryId: updatedProduct.sub_category_id,
            isAvailable: updatedProduct.is_available,
            isBestSeller: updatedProduct.is_best_seller,
            isFeatured: updatedProduct.is_featured,
            colorVariants: insertedColorVariants,
            sizes: insertedSizes
        });

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
