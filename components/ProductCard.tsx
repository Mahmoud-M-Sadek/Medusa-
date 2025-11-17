import React from 'react';
import type { Product } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group block overflow-hidden">
      <div className="relative h-[350px] sm:h-[450px]">
        <img
          src={product.colorVariants[0].images[0]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-80"
        />
      </div>

      <div className="relative bg-white pt-3 text-center">
        <h3 className="text-lg text-black group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h3>
        
        <p className="mt-1.5 tracking-wider text-black">
            {product.originalPrice && <span className="line-through text-gray-400 mr-2">{product.originalPrice} جنيه</span>}
            {product.price} جنيه
        </p>
        {!product.isAvailable && <p className="mt-1 text-sm text-red-500">غير متاح</p>}
      </div>
    </Link>
  );
};

export default ProductCard;
