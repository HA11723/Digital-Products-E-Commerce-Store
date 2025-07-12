import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Download } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  digital_file_url: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }
    await addToCart(product.id, 1);
  };

  if (viewMode === 'list') {
    return (
      <div className="product-card flex items-center space-x-6">
        <div className="flex-shrink-0">
          <img
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 mt-2 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center space-x-3 mt-4">
            <Link
              to={`/products/${product.id}`}
              className="btn-outline text-sm flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </Link>
            
            <button
              onClick={handleAddToCart}
              className="btn-primary text-sm flex items-center space-x-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={product.image_url || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
            <Link
              to={`/products/${product.id}`}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={handleAddToCart}
              className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
        
        <p className="text-sm text-gray-500">{product.category}</p>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <Link
            to={`/products/${product.id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View Details
          </Link>
          
          <button
            onClick={handleAddToCart}
            className="btn-primary text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 