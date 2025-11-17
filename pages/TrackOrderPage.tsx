import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { AppContextType, Order, OrderStatus } from '../types';
import { TruckIcon, ShieldCheckIcon } from '../components/Icons';

const OrderStatusVisualizer: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statuses: OrderStatus[] = ['تحت المراجعة', 'تم التأكيد', 'تم الشحن', 'تم التوصيل'];
    const currentStatusIndex = statuses.indexOf(status);

    if (status === 'ملغي') {
        return (
            <div className="p-4 text-center bg-red-50 border border-red-200 rounded-lg">
                <p className="font-bold text-red-600">تم إلغاء هذا الطلب.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-start text-center text-sm font-medium text-gray-500">
                {statuses.map((s, index) => (
                    <div key={s} className={`flex-1 ${index > 0 ? 'relative' : ''}`}>
                        {index > 0 &&
                            <div className={`absolute right-1/2 top-4 h-0.5 w-full ${index <= currentStatusIndex ? 'bg-black' : 'bg-gray-200'}`} />
                        }
                        <div className="relative">
                            <div className={`mx-auto h-8 w-8 rounded-full flex items-center justify-center border-2 ${index <= currentStatusIndex ? 'bg-black border-black text-white' : 'bg-white border-gray-200'}`}>
                                {s === 'تم الشحن' ? <TruckIcon className="w-4 h-4" /> : s === 'تم التوصيل' ? <ShieldCheckIcon className="w-4 h-4" /> : <span className="text-xs">{index + 1}</span>}
                            </div>
                        </div>
                        <p className={`mt-2 ${index <= currentStatusIndex ? 'text-black font-bold' : ''}`}>{s}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const TrackOrderPage: React.FC = () => {
    const { orderId } = useParams<{ orderId?: string }>();
    const navigate = useNavigate();
    const { orders } = useContext(AppContext) as AppContextType;
    
    const [searchId, setSearchId] = useState('');
    const [error, setError] = useState('');

    const foundOrder = useMemo(() => {
        if (!orderId) return null;
        const order = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
        if (!order) {
            setError('لم يتم العثور على طلب بهذا الرقم.');
            return null;
        }
        setError('');
        return order;
    }, [orderId, orders]);
    
    useEffect(() => {
        if(orderId) setSearchId(orderId);
    }, [orderId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if(!searchId) return;
        navigate(`/track-order/${searchId}`);
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold sm:text-3xl">تتبع طلبك</h1>
                        <p className="mt-4 text-gray-500">
                           أدخل رقم الطلب الخاص بك لمعرفة حالته الحالية.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2 mb-12">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="مثال: MEDUSA-123456"
                            className="w-full rounded-lg border-gray-300 p-3 text-sm focus:border-black focus:ring-black"
                        />
                        <button type="submit" className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800">
                            تتبع
                        </button>
                    </form>
                    
                    {error && <p className="text-center text-red-500">{error}</p>}

                    {foundOrder && (
                        <div className="space-y-8">
                            <div className="rounded-lg border border-gray-200 p-6">
                                <h2 className="text-xl font-bold mb-4">حالة الطلب: {foundOrder.status}</h2>
                                <OrderStatusVisualizer status={foundOrder.status} />
                            </div>
                            
                            <div className="rounded-lg border border-gray-200 p-6">
                                <h2 className="text-xl font-bold mb-4">تفاصيل الطلب</h2>
                                <div className="flow-root">
                                    <dl className="-my-4 divide-y divide-gray-100 text-sm">
                                        <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                                            <dt className="font-medium text-gray-900">رقم الطلب</dt>
                                            <dd className="text-gray-700 sm:col-span-2 font-mono">{foundOrder.id}</dd>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                                            <dt className="font-medium text-gray-900">تاريخ الطلب</dt>
                                            <dd className="text-gray-700 sm:col-span-2">{foundOrder.timestamp}</dd>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                                            <dt className="font-medium text-gray-900">بيانات العميل</dt>
                                            <dd className="text-gray-700 sm:col-span-2">
                                                {foundOrder.customerName}<br />
                                                {foundOrder.customerPhone}<br />
                                                {foundOrder.customerAddress}
                                            </dd>
                                        </div>
                                        <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                                            <dt className="font-medium text-gray-900">ملخص الطلب</dt>
                                            <dd className="text-gray-700 sm:col-span-2">
                                                <ul className="space-y-2">
                                                    {foundOrder.items.map(item => (
                                                        <li key={item.productId+item.color+item.size}>{item.name} (×{item.quantity})</li>
                                                    ))}
                                                </ul>
                                            </dd>
                                        </div>
                                         <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-3 sm:gap-4">
                                            <dt className="font-medium text-gray-900">الإجمالي</dt>
                                            <dd className="text-gray-700 sm:col-span-2 font-bold">{foundOrder.totalPrice} جنيه</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;