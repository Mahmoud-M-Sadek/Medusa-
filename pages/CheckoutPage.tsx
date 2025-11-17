import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { AppContextType, Order } from '../types';
import { WhatsAppIcon } from '../components/Icons';

const CheckoutPage: React.FC = () => {
  const { cart, addOrder, clearCart } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (cart.length === 0 && !placedOrder) {
      navigate('/cart');
    }
  }, [cart, navigate, placedOrder]);

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
    const newOrder = addOrder({
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        items: orderItems,
        totalPrice: total,
    });
    
    // Create WhatsApp message
    let message = `
طلب جديد من MODESSA:
*رقم الطلب: ${newOrder.id}*
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
    
    // Clear cart and update state
    clearCart();
    setPlacedOrder(newOrder);
    window.open(whatsappUrl, '_blank');
  };

  if (placedOrder) {
    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-green-700">تم استلام طلبك بنجاح!</h1>
            <p className="mt-4 text-gray-600">
                شكرًا لثقتك في MODESSA. لقد تم إرسال تفاصيل طلبك عبر واتساب.
            </p>
            <div className="mt-6 p-4 bg-gray-100 rounded-lg inline-block">
                <p className="text-sm text-gray-700">رقم طلبك هو:</p>
                <p className="text-xl font-bold tracking-widest">{placedOrder.id}</p>
            </div>
            <p className="mt-4 text-gray-600">يمكنك استخدام هذا الرقم لتتبع حالة طلبك.</p>
            <div className="mt-8 flex justify-center gap-4">
                 <Link to={`/track-order/${placedOrder.id}`} className="inline-block rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800">
                    تتبع طلبك
                </Link>
                <Link to="/shop" className="inline-block rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-black hover:bg-gray-50">
                    متابعة التسوق
                </Link>
            </div>
        </div>
    )
  }

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