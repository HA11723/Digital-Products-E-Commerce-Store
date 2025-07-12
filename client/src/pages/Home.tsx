import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Download, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Download,
      title: 'Instant Download',
      description: 'Get your digital products immediately after purchase'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Curated collection of high-quality digital assets'
    },
    {
      icon: Sparkles,
      title: 'Professional Tools',
      description: 'Everything you need for your creative projects'
    }
  ];

  const categories = [
    { name: 'Templates', count: '50+', color: 'from-blue-500 to-blue-600' },
    { name: 'Icons', count: '200+', color: 'from-green-500 to-green-600' },
    { name: 'Fonts', count: '100+', color: 'from-purple-500 to-purple-600' },
    { name: 'Graphics', count: '150+', color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 gradient-bg rounded-3xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Premium Digital Products for{' '}
            <span className="text-gradient">Creators</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover high-quality templates, icons, fonts, and graphics to elevate your creative projects. 
            Instant downloads, professional quality, endless possibilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="btn-outline text-lg px-8 py-3"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Digital Store?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide everything you need to create amazing digital content with professional quality and ease.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-600">
            Find the perfect digital assets for your next project
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${category.name.toLowerCase()}`}
              className="group block"
            >
              <div className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white text-center transition-transform group-hover:scale-105`}>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-white/80">{category.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 rounded-3xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Creating?
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of creators who trust Digital Store for their digital assets. 
          Start building amazing projects today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create Account
          </Link>
          <Link
            to="/products"
            className="border border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 