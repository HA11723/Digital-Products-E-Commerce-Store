import { db } from './config/database';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    db.run(
      'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@digitalstore.com', adminPassword, 'admin'],
      function(err) {
        if (err) {
          console.error('Error creating admin user:', err);
        } else {
          console.log('Admin user created with ID:', this.lastID);
        }
      }
    );

    // Create sample products with better images
    const sampleProducts = [
      {
        name: 'Modern Website Template',
        description: 'A beautiful, responsive website template perfect for businesses and portfolios. Includes HTML, CSS, and JavaScript files with modern design principles.',
        price: 29.99,
        category: 'Templates',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center',
        digital_file_url: 'https://example.com/template.zip',
        stock: 100
      },
      {
        name: 'Icon Pack - Business',
        description: 'Professional icon set with 200+ high-quality SVG icons perfect for business applications and websites. Includes multiple formats and sizes.',
        price: 19.99,
        category: 'Icons',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center',
        digital_file_url: 'https://example.com/icons.zip',
        stock: 50
      },
      {
        name: 'Premium Font Collection',
        description: 'Collection of 10 premium fonts including serif, sans-serif, and display fonts. Perfect for branding and design projects with commercial license.',
        price: 39.99,
        category: 'Fonts',
        image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center',
        digital_file_url: 'https://example.com/fonts.zip',
        stock: 75
      },
      {
        name: 'Social Media Graphics Pack',
        description: 'Complete set of social media templates for Instagram, Facebook, Twitter, and LinkedIn. Includes PSD and AI files with customizable elements.',
        price: 24.99,
        category: 'Graphics',
        image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop&crop=center',
        digital_file_url: 'https://example.com/graphics.zip',
        stock: 25
      },
      {
        name: 'E-commerce UI Kit',
        description: 'Complete UI kit for e-commerce applications. Includes components for product listings, cart, checkout, and user dashboard with React components.',
        price: 49.99,
        category: 'Templates',
        image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center',
        digital_file_url: 'https://example.com/ecommerce.zip',
        stock: 30
      },
      {
        name: 'Minimal Logo Templates',
        description: 'Set of 50 minimal logo templates in various styles. Perfect for startups and small businesses with vector formats included.',
        price: 34.99,
        category: 'Graphics',
        image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center',
        digital_file_url: 'https://example.com/logos.zip',
        stock: 40
      },
      {
        name: 'Mobile App Template',
        description: 'Complete mobile app template with React Native components. Includes authentication, navigation, and common UI patterns.',
        price: 44.99,
        category: 'Templates',
        image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&crop=center',
        digital_file_url: 'https://example.com/mobile-app.zip',
        stock: 35
      },
      {
        name: 'Dashboard UI Kit',
        description: 'Professional dashboard UI kit with charts, tables, and admin components. Built with modern design principles and accessibility in mind.',
        price: 59.99,
        category: 'Templates',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center',
        digital_file_url: 'https://example.com/dashboard.zip',
        stock: 20
      }
    ];

    sampleProducts.forEach((product, index) => {
      db.run(
        'INSERT OR IGNORE INTO products (name, description, price, category, image_url, digital_file_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.category, product.image_url, product.digital_file_url, product.stock],
        function(err) {
          if (err) {
            console.error(`Error creating product ${index + 1}:`, err);
          } else {
            console.log(`Product "${product.name}" created with ID:`, this.lastID);
          }
        }
      );
    });

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seed function
seedDatabase(); 