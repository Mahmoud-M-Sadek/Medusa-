import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { AppContextType } from '../types';
import { WhatsAppIcon } from '../components/Icons';

const CheckoutPage: React.FC = () => {
  const { cart, addOrder, clearCart } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) {
      alert('يرجى ملء جميع الحقول.');
      return;
    }

    const orderItems = cart.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      color: item.selectedColor.name,
      size: item.selectedSize,
      quantity: item.quantity,
    }));
    
    // Add to local storage orders
    addOrder({
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        items: orderItems,
        totalPrice: total,
    });
    
    // Create WhatsApp message
    let message = `
طلب جديد من Medusa:
-------------------
*بيانات العميل:*
- الاسم: ${customer.name}
- رقم الموبايل: ${customer.phone}
- العنوان: ${customer.address}
-------------------
*المنتجات المطلوبة:*
`;
    cart.forEach(item => {
        message += `
- *المنتج*: ${item.name}
  - *اللون*: ${item.selectedColor.name}
  - *المقاس*: ${item.selectedSize}
  - *الكمية*: ${item.quantity}
  - *السعر*: ${item.price * item.quantity} جنيه
`;
    });
    message += `
-------------------
*الإجمالي: ${total} جنيه*
`;

    const whatsappUrl = `https://wa.me/201555414422?text=${encodeURIComponent(message.trim())}`;
    
    // Clear cart and navigate
    clearCart();
    window.open(whatsappUrl, '_blank');
    alert('شكرًا لطلبك! سيتم توجيهك إلى واتساب لإرسال الطلب.');
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold sm:text-3xl text-center mb-8">إتمام الطلب</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
          <div className="space-y-4 rounded-lg border border-gray-200 p-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                <div>
                  <h3 className="text-sm font-medium">{item.name} <span className="text-xs">(×{item.quantity})</span></h3>
                  <p className="text-xs text-gray-500">{item.selectedColor.name}, {item.selectedSize}</p>
                </div>
                <p className="ml-auto text-sm font-medium">{item.price * item.quantity} جنيه</p>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t pt-4 mt-4">
              <span>الإجمالي</span>
              <span>{total} جنيه</span>
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <div>
          <h2 className="text-xl font-bold mb-4">بيانات التوصيل</h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">الاسم بالكامل</label>
              <input type="text" id="name" name="name" value={customer.name} onChange={handleChange} required className="w-full rounded-lg border-gray-200 p-3 text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-medium">رقم الموبايل</label>
              <input type="tel" id="phone" name="phone" value={customer.phone} onChange={handleChange} required className="w-full rounded-lg border-gray-200 p-3 text-sm" />
            </div>
            <div>
              <label htmlFor="address" className="text-sm font-medium">العنوان بالتفصيل</label>
              <textarea id="address" name="address" rows={4} value={customer.address} onChange={handleChange} required className="w-full rounded-lg border-gray-200 p-3 text-sm"></textarea>
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-md bg-black px-8 py-3 text-white transition hover:bg-gray-800">
              <WhatsAppIcon className="w-5 h-5" />
              <span className="text-sm font-medium">تأكيد الطلب عبر واتساب</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;