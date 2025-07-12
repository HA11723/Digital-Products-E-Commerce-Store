import React from 'react';

const Orders: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      <div className="card p-6">
        <p className="text-gray-600">No orders yet. Start shopping to see your order history here.</p>
      </div>
    </div>
  );
};

export default Orders; 