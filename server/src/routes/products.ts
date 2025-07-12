import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/database';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  
  let query = 'SELECT * FROM products WHERE is_active = 1';
  let params: any[] = [];
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);
  
  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_active = 1';
    let countParams: any[] = [];
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    db.get(countQuery, countParams, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      const total = (result as any)?.total || 0;
      
      res.json({
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    });
  });
});

// Get single product
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM products WHERE id = ? AND is_active = 1', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product });
  });
});

// Create product (admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').optional(),
  body('category').optional(),
  body('image_url').optional(),
  body('digital_file_url').optional(),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, image_url, digital_file_url, stock } = req.body;
    
    db.run(
      'INSERT INTO products (name, description, price, category, image_url, digital_file_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, category, image_url, digital_file_url, stock],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error creating product' });
        }
        
        res.status(201).json({
          message: 'Product created successfully',
          productId: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, price, category, image_url, digital_file_url, stock, is_active } = req.body;
    
    db.run(
      'UPDATE products SET name = COALESCE(?, name), description = COALESCE(?, description), price = COALESCE(?, price), category = COALESCE(?, category), image_url = COALESCE(?, image_url), digital_file_url = COALESCE(?, digital_file_url), stock = COALESCE(?, stock), is_active = COALESCE(?, is_active), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, price, category, image_url, digital_file_url, stock, is_active, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error updating product' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ message: 'Product updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  
  db.run('UPDATE products SET is_active = 0 WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting product' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  });
});

// Get categories
router.get('/categories/list', (req, res) => {
  db.all('SELECT DISTINCT category FROM products WHERE is_active = 1 AND category IS NOT NULL', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ categories: (categories as any[]).map(cat => cat.category) });
  });
});

export default router; 