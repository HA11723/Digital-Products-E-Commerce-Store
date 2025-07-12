import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/database';
import { auth } from '../middleware/auth';

const router = express.Router();

// Create order (checkout)
router.post('/create', auth, [
  body('items').isArray().withMessage('Items must be an array'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be positive')
], (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { items, totalAmount, paymentIntentId } = req.body;
    
    // Start transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      // Create order
      db.run(
        'INSERT INTO orders (user_id, total_amount, payment_intent_id, status) VALUES (?, ?, ?, ?)',
        [userId, totalAmount, paymentIntentId, 'completed'],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Error creating order' });
          }
          
          const orderId = this.lastID;
          let completed = 0;
          const totalItems = items.length;
          
          // Add order items
          items.forEach((item: any) => {
            db.run(
              'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
              [orderId, item.product_id, item.quantity, item.price],
              function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Error creating order items' });
                }
                
                completed++;
                if (completed === totalItems) {
                  // Clear cart
                  db.run('DELETE FROM cart WHERE user_id = ?', [userId], function(err) {
                    if (err) {
                      db.run('ROLLBACK');
                      return res.status(500).json({ error: 'Error clearing cart' });
                    }
                    
                    db.run('COMMIT');
                    res.status(201).json({
                      message: 'Order created successfully',
                      orderId
                    });
                  });
                }
              }
            );
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's orders
router.get('/', auth, (req: any, res) => {
  const userId = req.user.id;
  
  const query = `
    SELECT o.id, o.total_amount, o.status, o.created_at,
           oi.quantity, oi.price,
           p.name, p.image_url
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;
  
  db.all(query, [userId], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const ordersArray = orders as any[];
    // Group by order
    const groupedOrders = ordersArray.reduce((acc: any, item) => {
      if (!acc[item.id]) {
        acc[item.id] = {
          id: item.id,
          total_amount: item.total_amount,
          status: item.status,
          created_at: item.created_at,
          items: []
        };
      }
      acc[item.id].items.push({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url
      });
      return acc;
    }, {});
    
    res.json({ orders: Object.values(groupedOrders) });
  });
});

// Get single order
router.get('/:id', auth, (req: any, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  
  const query = `
    SELECT o.id, o.total_amount, o.status, o.created_at,
           oi.quantity, oi.price,
           p.name, p.image_url, p.digital_file_url
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = ? AND o.user_id = ?
  `;
  
  db.all(query, [id, userId], (err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    const itemsArray = items as any[];
    if (itemsArray.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = {
      id: itemsArray[0].id,
      total_amount: itemsArray[0].total_amount,
      status: itemsArray[0].status,
      created_at: itemsArray[0].created_at,
      items: itemsArray.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url,
        digital_file_url: item.digital_file_url
      }))
    };
    
    res.json({ order });
  });
});

export default router; 