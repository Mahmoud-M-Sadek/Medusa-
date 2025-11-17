import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import type { AppContextType, Product, MainCategory, Subcategory, ColorVariant, OrderStatus } from '../../types';
import { PlusCircleIcon, Trash2Icon, XIcon } from '../../components/Icons';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const ProductForm: React.FC<{ productToEdit?: Product; onFormSubmit: () => void; onCancel: () => void; }> = ({ productToEdit, onFormSubmit, onCancel }) => {
    const { mainCategories, subcategories, addProduct, updateProduct } = useContext(AppContext) as AppContextType;
    const [isLoading, setIsLoading] = useState(false);
    
    const [product, setProduct] = useState<Omit<Product, 'id'>>({
        name: '', description: '', price: 0, originalPrice: undefined, subCategoryId: 0, isAvailable: true,
        colorVariants: [{ name: '', colorCode: '#000000', images: [] }], sizes: [], isBestSeller: false, isFeatured: false,
    });
    const [selectedMainCat, setSelectedMainCat] = useState(0);

    useEffect(() => {
        if (productToEdit) {
            const subCat = subcategories.find(sc => sc.id === productToEdit.subCategoryId);
            setProduct(productToEdit);
            setSelectedMainCat(subCat?.mainCategoryId || 0);
        } else {
             const firstMainCatId = mainCategories[0]?.id || 0;
             const firstSubCat = subcategories.find(sc => sc.mainCategoryId === firstMainCatId);
             setSelectedMainCat(firstMainCatId);
             setProduct(prev => ({
                name: '', description: '', price: 0, originalPrice: undefined, 
                subCategoryId: firstSubCat?.id || 0, 
                isAvailable: true,
                colorVariants: [{ name: '', colorCode: '#000000', images: [] }], 
                sizes: [], 
                isBestSeller: false, 
                isFeatured: false,
             }));
        }
    }, [productToEdit, mainCategories, subcategories]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name === 'price' || name === 'originalPrice') {
             setProduct(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
             return;
        }
        if(name === 'subCategoryId') {
            setProduct(prev => ({...prev, subCategoryId: Number(value)}));
            return;
        }

        setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mainCatId = Number(e.target.value);
        setSelectedMainCat(mainCatId);
        const firstSubCatOfMain = subcategories.find(sc => sc.mainCategoryId === mainCatId);
        setProduct(prev => ({ ...prev, subCategoryId: firstSubCatOfMain?.id || 0 }));
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sizes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
        setProduct(prev => ({ ...prev, sizes }));
    };
    
    const handleColorChange = (index: number, field: keyof Omit<ColorVariant, 'images'>, value: string) => {
        const newVariants = [...product.colorVariants];
        (newVariants[index] as any)[field] = value;
        setProduct(prev => ({ ...prev, colorVariants: newVariants }));
    };

    const handleImagesChange = async (index: number, files: FileList | null) => {
        if (!files) return;
        const base64Promises = Array.from(files).map(file => toBase64(file));
        const newImages = await Promise.all(base64Promises);
        const newVariants = [...product.colorVariants];
        newVariants[index].images = [...newVariants[index].images, ...newImages];
        setProduct(prev => ({ ...prev, colorVariants: newVariants }));
    };
    
    const removeImage = (variantIndex: number, imageIndex: number) => {
        const newVariants = [...product.colorVariants];
        newVariants[variantIndex].images.splice(imageIndex, 1);
        setProduct(prev => ({ ...prev, colorVariants: newVariants }));
    };
    
    const addColorVariant = () => {
        setProduct(prev => ({ ...prev, colorVariants: [...prev.colorVariants, { name: '', colorCode: '#000000', images: [] }] }));
    };

    const removeColorVariant = (index: number) => {
        if (product.colorVariants.length <= 1) return;
        setProduct(prev => ({ ...prev, colorVariants: prev.colorVariants.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!product.subCategoryId) {
            alert('يرجى اختيار قسم فرعي.');
            return;
        }
        setIsLoading(true);
        try {
            if (productToEdit) {
                await updateProduct({ ...product, id: productToEdit.id });
            } else {
                await addProduct(product);
            }
            onFormSubmit();
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء حفظ المنتج.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const availableSubcategories = subcategories.filter(sc => sc.mainCategoryId === selectedMainCat);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold">{productToEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="اسم المنتج" name="name" value={product.name} onChange={handleChange} className="w-full rounded-md border-gray-300" required disabled={isLoading} />
                <input type="number" placeholder="السعر" name="price" value={product.price} onChange={handleChange} className="w-full rounded-md border-gray-300" required disabled={isLoading} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" placeholder="السعر الأصلي (قبل الخصم)" name="originalPrice" value={product.originalPrice || ''} onChange={handleChange} className="w-full rounded-md border-gray-300" disabled={isLoading} />
                <input type="text" placeholder="المقاسات (مفصولة بفاصلة)" name="sizes" value={product.sizes.join(', ')} onChange={handleSizeChange} className="w-full rounded-md border-gray-300" disabled={isLoading} />
            </div>
            <textarea placeholder="الوصف" name="description" value={product.description} onChange={handleChange} rows={3} className="w-full rounded-md border-gray-300" disabled={isLoading}></textarea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={selectedMainCat} onChange={handleMainCategoryChange} className="w-full rounded-md border-gray-300" disabled={isLoading}>
                     {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select name="subCategoryId" value={product.subCategoryId} onChange={handleChange} className="w-full rounded-md border-gray-300" required disabled={isLoading}>
                    {availableSubcategories.length > 0 ? availableSubcategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>) : <option value="" disabled>اختر قسم رئيسي أولاً</option>}
                </select>
            </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center"><input id="isAvailable" name="isAvailable" type="checkbox" checked={product.isAvailable} onChange={handleChange} className="h-4 w-4 rounded" disabled={isLoading} /><label htmlFor="isAvailable" className="mr-2">متاح</label></div>
                <div className="flex items-center"><input id="isBestSeller" name="isBestSeller" type="checkbox" checked={product.isBestSeller} onChange={handleChange} className="h-4 w-4 rounded" disabled={isLoading} /><label htmlFor="isBestSeller" className="mr-2">الأكثر مبيعًا</label></div>
                <div className="flex items-center"><input id="isFeatured" name="isFeatured" type="checkbox" checked={product.isFeatured} onChange={handleChange} className="h-4 w-4 rounded" disabled={isLoading} /><label htmlFor="isFeatured" className="mr-2">مميز</label></div>
            </div>

            <div className="space-y-4 border-t pt-4">
                <h4 className="font-bold">الألوان والصور</h4>
                {product.colorVariants.map((variant, index) => (
                    <div key={index} className="space-y-3 border p-4 rounded-md bg-white">
                        <div className="flex gap-4 items-center">
                            <input type="text" placeholder="اسم اللون" value={variant.name} onChange={e => handleColorChange(index, 'name', e.target.value)} className="rounded-md border-gray-300 flex-grow" required disabled={isLoading} />
                            <input type="color" value={variant.colorCode} onChange={e => handleColorChange(index, 'colorCode', e.target.value)} className="h-10 w-16 rounded-md p-0 border-0" disabled={isLoading} />
                            <button type="button" onClick={() => removeColorVariant(index)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={product.colorVariants.length <= 1 || isLoading}><Trash2Icon /></button>
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">صور هذا اللون</label>
                             <input type="file" accept="image/*" multiple onChange={e => handleImagesChange(index, e.target.files)} className="text-sm" disabled={isLoading} />
                             <div className="mt-2 flex flex-wrap gap-2">
                                 {variant.images.map((img, imgIndex) => (
                                     <div key={imgIndex} className="relative">
                                         <img src={img} alt="preview" className="w-20 h-20 object-cover rounded-md" />
                                         <button type="button" onClick={() => removeImage(index, imgIndex)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5" disabled={isLoading}><XIcon className="w-3 h-3"/></button>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addColorVariant} className="flex items-center gap-2 text-sm text-black" disabled={isLoading}><PlusCircleIcon /> إضافة لون آخر</button>
            </div>
            
            <div className="flex justify-end gap-4 border-t pt-4">
                <button type="button" onClick={onCancel} className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300" disabled={isLoading}>إلغاء</button>
                <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50" disabled={isLoading}>
                    {isLoading ? 'جاري الحفظ...' : (productToEdit ? 'حفظ التعديلات' : 'إضافة المنتج')}
                </button>
            </div>
        </form>
    );
};

const MainCategoryManager: React.FC = () => {
    const { mainCategories, addMainCategory, updateMainCategory, deleteMainCategory, subcategories, products } = useContext(AppContext) as AppContextType;
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [editingCategory, setEditingCategory] = useState<MainCategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !image) return;
        setIsLoading(true);
        try {
            if (editingCategory) {
                await updateMainCategory({ ...editingCategory, name, image });
            } else {
                await addMainCategory({ name, image });
            }
            setName('');
            setImage('');
            setEditingCategory(null);
        } catch (error) {
            alert('حدث خطأ');
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleImageUpload = async (file: File | null) => {
        if(!file) return;
        const base64 = await toBase64(file);
        setImage(base64);
    }
    
    const handleEdit = (category: MainCategory) => {
        setEditingCategory(category);
        setName(category.name);
        setImage(category.image);
    }

    const handleDelete = async (id: number) => {
        if(window.confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف الأقسام الفرعية والمنتجات المرتبطة به.')) {
            await deleteMainCategory(id);
        }
    }

    const getProductCount = (mainCategoryId: number) => {
        const relevantSubcategories = subcategories.filter(sc => sc.mainCategoryId === mainCategoryId).map(sc => sc.id);
        return products.filter(p => relevantSubcategories.includes(p.subCategoryId)).length;
    }
    
    const resetForm = () => {
        setEditingCategory(null); 
        setName(''); 
        setImage('');
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit} className="md:col-span-1 bg-white p-6 rounded-lg shadow space-y-4 self-start">
                <h3 className="text-xl font-bold">{editingCategory ? 'تعديل قسم رئيسي' : 'إضافة قسم رئيسي'}</h3>
                <input type="text" placeholder="اسم القسم" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-md border-gray-300" required disabled={isLoading} />
                <div>
                     <label className="text-sm">صورة القسم</label>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files ? e.target.files[0] : null)} className="w-full text-sm" disabled={isLoading} />
                    {image && <img src={image} alt="preview" className="w-24 h-24 mt-2 object-cover rounded-md"/>}
                </div>
                <button type="submit" className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50" disabled={isLoading}>
                    {isLoading ? 'جاري الحفظ...' : (editingCategory ? 'حفظ التعديلات' : 'إضافة')}
                </button>
                {editingCategory && <button type="button" onClick={resetForm} className="w-full mt-2 text-center text-sm" disabled={isLoading}>إلغاء التعديل</button>}
            </form>
            <div className="md:col-span-2 bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                    {mainCategories.map(c => (
                        <li key={c.id} className="p-4 flex items-center justify-between">
                             <div className="flex items-center">
                                <img src={c.image} alt={c.name} className="w-16 h-16 object-cover rounded-md" />
                                <div className="mr-4">
                                    <p className="font-bold">{c.name}</p>
                                    <p className="text-sm text-gray-500">عدد المنتجات: {getProductCount(c.id)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(c)} className="text-sm bg-gray-100 text-black px-3 py-1 rounded-md">تعديل</button>
                                <button onClick={() => handleDelete(c.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded-md">حذف</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

const SubcategoryManager: React.FC = () => {
    const { mainCategories, subcategories, addSubcategory, updateSubcategory, deleteSubcategory, products } = useContext(AppContext) as AppContextType;
    const [name, setName] = useState('');
    const [mainCategoryId, setMainCategoryId] = useState(mainCategories[0]?.id || 0);
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !mainCategoryId) return;
        setIsLoading(true);
        try {
            if (editingSubcategory) {
                await updateSubcategory({ ...editingSubcategory, name, mainCategoryId });
            } else {
                await addSubcategory({ name, mainCategoryId });
            }
            setName('');
            setEditingSubcategory(null);
        } catch (error) {
            alert('حدث خطأ');
        } finally {
            setIsLoading(false);
        }
    }

    const handleEdit = (subcategory: Subcategory) => {
        setEditingSubcategory(subcategory);
        setName(subcategory.name);
        setMainCategoryId(subcategory.mainCategoryId);
    }

    const handleDelete = async (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا القسم الفرعي؟ سيتم حذف المنتجات المرتبطة به.')) {
            await deleteSubcategory(id);
        }
    }
    
    const resetForm = () => {
        setEditingSubcategory(null); 
        setName(''); 
        setMainCategoryId(mainCategories[0]?.id || 0)
    }

    const getProductCount = (subcategoryId: number) => {
        return products.filter(p => p.subCategoryId === subcategoryId).length;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit} className="md:col-span-1 bg-white p-6 rounded-lg shadow space-y-4 self-start">
                <h3 className="text-xl font-bold">{editingSubcategory ? 'تعديل قسم فرعي' : 'إضافة قسم فرعي'}</h3>
                <input type="text" placeholder="اسم القسم الفرعي" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-md border-gray-300" required disabled={isLoading} />
                <select value={mainCategoryId} onChange={e => setMainCategoryId(Number(e.target.value))} className="w-full rounded-md border-gray-300" disabled={isLoading}>
                    <option value={0} disabled>اختر القسم الرئيسي</option>
                    {mainCategories.map(mc => <option key={mc.id} value={mc.id}>{mc.name}</option>)}
                </select>
                <button type="submit" className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50" disabled={isLoading}>
                    {isLoading ? 'جاري الحفظ...' : (editingSubcategory ? 'حفظ التعديلات' : 'إضافة')}
                </button>
                {editingSubcategory && <button type="button" onClick={resetForm} className="w-full mt-2 text-center text-sm" disabled={isLoading}>إلغاء التعديل</button>}
            </form>
            <div className="md:col-span-2 bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                    {subcategories.map(sc => (
                        <li key={sc.id} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-bold">{sc.name}</p>
                                <p className="text-sm text-gray-500">
                                    القسم الرئيسي: {mainCategories.find(mc => mc.id === sc.mainCategoryId)?.name || 'N/A'} | عدد المنتجات: {getProductCount(sc.id)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(sc)} className="text-sm bg-gray-100 text-black px-3 py-1 rounded-md">تعديل</button>
                                <button onClick={() => handleDelete(sc.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded-md">حذف</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}


const AdminDashboardPage: React.FC = () => {
    const { isLoggedIn, logout, products, deleteProduct, orders, updateOrderStatus } = useContext(AppContext) as AppContextType;
    const [activeTab, setActiveTab] = useState('products');
    const [showForm, setShowForm] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
    const navigate = useNavigate();

    if (!isLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const handleDeleteProduct = (id: number) => {
        if(window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            deleteProduct(id);
        }
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setShowForm(true);
    };

    const handleAddNewProduct = () => {
        setProductToEdit(undefined);
        setShowForm(true);
    };
    
    const onFormSubmit = () => {
        setShowForm(false);
        setProductToEdit(undefined);
    }
    
    const tabClass = (tabName: string) => `px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === tabName ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`;
    const orderStatuses: OrderStatus[] = ['تحت المراجعة', 'تم التأكيد', 'تم الشحن', 'تم التوصيل', 'ملغي'];

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
                    <button onClick={handleLogout} className="text-sm text-white bg-black rounded-md px-4 py-2 hover:bg-gray-800">تسجيل الخروج</button>
                </header>
                
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-2 sm:space-x-4" aria-label="Tabs">
                        <button onClick={() => { setActiveTab('products'); setShowForm(false); }} className={tabClass('products')}>المنتجات</button>
                        <button onClick={() => setActiveTab('main_categories')} className={tabClass('main_categories')}>الأقسام الرئيسية</button>
                        <button onClick={() => setActiveTab('sub_categories')} className={tabClass('sub_categories')}>الأقسام الفرعية</button>
                        <button onClick={() => setActiveTab('orders')} className={tabClass('orders')}>الطلبات</button>
                    </nav>
                </div>
                
                <div>
                    {activeTab === 'products' && (
                        <div>
                            {showForm ? (
                                <ProductForm productToEdit={productToEdit} onFormSubmit={onFormSubmit} onCancel={onFormSubmit} />
                            ) : (
                                <>
                                <div className="flex justify-end mb-4">
                                    <button onClick={handleAddNewProduct} className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm">
                                        <PlusCircleIcon /> إضافة منتج جديد
                                    </button>
                                </div>
                                <div className="bg-white shadow overflow-hidden rounded-md">
                                     <ul className="divide-y divide-gray-200">
                                        {products.map(p => (
                                            <li key={p.id} className="p-4 flex items-center justify-between flex-wrap">
                                                <div className="flex items-center mb-2 sm:mb-0">
                                                    <img src={p.colorVariants[0]?.images[0]} alt={p.name} className="w-16 h-16 object-cover rounded-md bg-gray-100" />
                                                    <div className="mr-4">
                                                        <p className="font-bold">{p.name}</p>
                                                        <p className="text-sm text-gray-500">{p.price} جنيه</p>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {p.isAvailable ? 'متاح' : 'غير متاح'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditProduct(p)} className="text-sm bg-gray-100 text-black px-3 py-1 rounded-md">تعديل</button>
                                                    <button onClick={() => handleDeleteProduct(p.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded-md">حذف</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'main_categories' && (
                        <MainCategoryManager />
                    )}

                    {activeTab === 'sub_categories' && (
                        <SubcategoryManager />
                    )}
                    
                    {activeTab === 'orders' && (
                         <div className="bg-white shadow overflow-hidden rounded-md">
                             <div className="p-4 border-b">
                                 <h3 className="font-bold">سجل الطلبات ({orders.length})</h3>
                                 <p className="text-sm text-gray-500">هذه الطلبات تم إنشاؤها من صفحة إتمام الطلب.</p>
                            </div>
                            <div className="space-y-4 p-4">
                                {orders.length > 0 ? orders.map(order => (
                                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start flex-wrap gap-2 mb-4 pb-4 border-b">
                                            <div>
                                                <p className="font-bold text-lg">{order.customerName}</p>
                                                <p className="text-sm text-gray-600">رقم الطلب: <span className="font-mono">{order.id}</span></p>
                                                <p className="text-sm text-gray-600">{order.customerPhone}</p>
                                                <p className="text-sm text-gray-600">{order.customerAddress}</p>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold">الإجمالي: {order.totalPrice} جنيه</p>
                                                <p className="text-xs text-gray-500">تاريخ الطلب: {order.timestamp}</p>
                                                <div className="mt-2">
                                                    <label htmlFor={`status-${order.id}`} className="sr-only">حالة الطلب</label>
                                                    <select
                                                        id={`status-${order.id}`}
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                        className="rounded-md border-gray-300 text-sm"
                                                    >
                                                        {orderStatuses.map(status => (
                                                            <option key={status} value={status}>{status}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="font-bold mb-2">المنتجات المطلوبة:</h4>
                                        <ul className="space-y-2">
                                            {order.items.map(item => (
                                                <li key={item.productId + item.size + item.color} className="flex justify-between text-sm">
                                                    <span>{item.name} (×{item.quantity}) - {item.color} / {item.size}</span>
                                                    <span>{item.price * item.quantity} جنيه</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )) : <p className="p-4 text-center text-gray-500">لا توجد طلبات مسجلة.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;