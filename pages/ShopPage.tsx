import React, { useContext, useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../types';

const ShopPage: React.FC = () => {
    const { products, mainCategories, subcategories } = useContext(AppContext) as AppContextType;
    const location = useLocation();
    const navigate = useNavigate();

    const getInitialSubCat = () => {
        const params = new URLSearchParams(location.search);
        return params.get('sub_cat') || null;
    }

    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(getInitialSubCat());

     useEffect(() => {
        const params = new URLSearchParams(location.search);
        const subCatId = params.get('sub_cat');
        setSelectedSubcategoryId(subCatId);
    }, [location.search]);


    const filteredProducts = useMemo(() => {
        const availableProducts = products.filter(p => p.isAvailable);
        if (!selectedSubcategoryId) {
            return availableProducts;
        }
        return availableProducts.filter(p => p.subCategoryId === selectedSubcategoryId);
    }, [products, selectedSubcategoryId]);

    const handleSubcategorySelect = (subcategoryId: string | null) => {
        setSelectedSubcategoryId(subcategoryId);
        const params = new URLSearchParams(location.search);
        if(subcategoryId) {
            params.set('sub_cat', subcategoryId);
        } else {
            params.delete('sub_cat');
        }
        navigate({ search: params.toString() });
    }
    
    const selectedSubcategory = subcategories.find(sc => sc.id === selectedSubcategoryId);
    const selectedMainCategory = mainCategories.find(mc => mc.id === selectedSubcategory?.mainCategoryId);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <h3 className="text-xl font-bold mb-4">الأقسام</h3>
            <div className="space-y-4">
                <button 
                    onClick={() => handleSubcategorySelect(null)}
                    className={`w-full text-right pr-4 py-2 rounded-md text-sm font-medium ${!selectedSubcategoryId ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                >
                    كل المنتجات
                </button>
              {mainCategories.map(mainCat => (
                <div key={mainCat.id}>
                  <h4 className="font-bold text-md mb-2">{mainCat.name}</h4>
                  <ul className="space-y-1">
                    {subcategories
                      .filter(subCat => subCat.mainCategoryId === mainCat.id)
                      .map(subCat => (
                        <li key={subCat.id}>
                          <button
                            onClick={() => handleSubcategorySelect(subCat.id)}
                            className={`w-full text-right pr-4 py-2 rounded-md text-sm transition ${selectedSubcategoryId === subCat.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                          >
                            {subCat.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="text-right mb-10">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    {selectedSubcategory ? selectedSubcategory.name : 'كل المنتجات'}
                </h2>
                {selectedMainCategory && <p className="text-gray-500 mt-1">{selectedMainCategory.name}</p>}
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 mt-10 col-span-full">لا توجد منتجات متاحة في هذا القسم حاليًا.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;