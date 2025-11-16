import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { AppContextType } from '../types';
import { Trash2Icon, PlusIcon, MinusIcon } from '../components/Icons';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartItemQuantity } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold">سلة التسوق فارغة</h1>
        <p className="mt-2 text-gray-500">لم تقم بإضافة أي منتجات بعد.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800">
          اذهب للتسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl text-center mb-8">سلة التسوق</h1>
      <div className="mt-8">
        <div className="flow-root">
          <ul className="-my-8 divide-y divide-gray-200">
            {cart.map(item => (
              <li key={item.id} className="flex flex-col sm:flex-row py-8">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-32 rounded object-cover mx-auto sm:mx-0"
                />
                <div className="flex-1 sm:ml-4 mt-4 sm:mt-0 text-center sm:text-right">
                  <h3 className="text-lg font-bold text-gray-900">
                    <Link to={`/product/${item.productId}`} className="hover:underline">{item.name}</Link>
                  </h3>
                  <dl className="mt-1 flex justify-center sm:justify-start flex-wrap text-xs text-gray-500">
                    <div className="ml-4"><dt className="inline">اللون: </dt><dd className="inline">{item.selectedColor.name}</dd></div>
                    <div className="ml-4"><dt className="inline">المقاس: </dt><dd className="inline">{item.selectedSize}</dd></div>
                    <div className="ml-4"><dt className="inline">السعر: </dt><dd className="inline">{item.price} جنيه</dd></div>
                  </dl>
                   <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                        <div className="flex items-center rounded border border-gray-200">
                            <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="h-10 w-10 leading-10 text-gray-600 transition hover:opacity-75"><MinusIcon className="w-4 h-4 mx-auto"/></button>
                            <input type="number" value={item.quantity} readOnly className="h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none" />
                            <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="h-10 w-10 leading-10 text-gray-600 transition hover:opacity-75"><PlusIcon className="w-4 h-4 mx-auto"/></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-600 transition"><Trash2Icon /></button>
                   </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex justify-end border-t border-gray-200 pt-8">
          <div className="w-full max-w-lg space-y-4">
            <dl className="space-y-0.5 text-sm text-gray-700">
              <div className="flex justify-between !text-base font-medium">
                <dt>الإجمالي</dt>
                <dd>{total} جنيه</dd>
              </div>
            </dl>
            <div className="flex justify-end">
                <button onClick={() => navigate('/checkout')} className="block rounded-md bg-black px-5 py-3 text-sm text-white transition hover:bg-gray-800">
                    إتمام الطلب
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;