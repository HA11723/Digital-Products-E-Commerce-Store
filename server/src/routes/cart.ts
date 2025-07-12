import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/database';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get user's cart
router.get('/', auth, (req: any, res) => {
  const userId = req.user.id;
  
  const query = `
    SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.digital_file_url
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ? AND p.is_active = 1
  `;
  
  db.all(query, [userId], (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const items = cartItems as any[];
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      items: items,
      total: total.toFixed(2)
    });
  });
});

// Add item to cart
router.post('/add', auth, [
  body('productId').isInt().withMessage('Product ID must be a number'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { productId, quantity } = req.body;
    
    // Check if product exists and is active
    db.get('SELECT * FROM products WHERE id = ? AND is_active = 1', [productId], (err, product) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Check if item already in cart
      db.get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId], (err, existingItem) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (existingItem) {
          // Update quantity
          const item = existingItem as any;
          const newQuantity = item.quantity + quantity;
          db.run(
            'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [newQuantity, userId, productId],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Error updating cart' });
              }
              res.json({ message: 'Cart updated successfully' });
            }
          );
        } else {
          // Add new item
          db.run(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [userId, productId, quantity],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Error adding to cart' });
              }
              res.json({ message: 'Item added to cart successfully' });
            }
          );
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cart item quantity
router.put('/update/:productId', auth, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    
    db.run(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error updating cart' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Cart item not found' });
        }
        
        res.json({ message: 'Cart updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, (req: any, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  
  db.run(
    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, productId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error removing from cart' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      res.json({ message: 'Item removed from cart successfully' });
    }
  );
});

// Clear cart
router.delete('/clear', auth, (req: any, res) => {
  const userId = req.user.id;
  
  db.run('DELETE FROM cart WHERE user_id = ?', [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error clearing cart' });
    }
    
    res.json({ message: 'Cart cleared successfully' });
  });
});

export default router; 