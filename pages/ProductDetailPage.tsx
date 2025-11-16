import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon } from '../components/Icons';

const ImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setCurrentIndex(0); // Reset index when images change
    }, [images]);

    if (!images || images.length === 0) {
        return <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">لا توجد صورة</div>;
    }
    
    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };


    return (
        <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <img
                    src={images[currentIndex]}
                    alt={`Product image ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                    <>
                    <button onClick={goToPrevious} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button onClick={goToNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition">
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((image, index) => (
                        <button key={index} onClick={() => setCurrentIndex(index)} className={`aspect-square w-full rounded-md overflow-hidden border-2 ${currentIndex === index ? 'border-black' : 'border-transparent'}`}>
                            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, mainCategories, subcategories, addToCart } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);
  
  const { mainCategory, subCategory } = useMemo(() => {
    if (!product) return { mainCategory: null, subCategory: null };
    const subCat = subcategories.find(sc => sc.id === product.subCategoryId);
    const mainCat = mainCategories.find(mc => mc.id === subCat?.mainCategoryId);
    return { mainCategory: mainCat, subCategory: subCat };
  }, [product, mainCategories, subcategories]);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes.length === 1 ? product.sizes[0] : '');
  
  useEffect(() => {
    if (product) {
        setSelectedSize(product.sizes.length === 1 ? product.sizes[0] : '');
        setSelectedColorIndex(0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold">لم يتم العثور على المنتج</h2>
        <Link to="/shop" className="mt-4 text-black underline">العودة إلى المتجر</Link>
      </div>
    );
  }

  const selectedColor = product.colorVariants[selectedColorIndex];

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
        alert('يرجى اختيار المقاس أولاً.');
        return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: selectedColor.images[0],
      selectedColor: selectedColor,
      selectedSize: selectedSize
    });

    alert('تمت إضافة المنتج إلى السلة بنجاح!');
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-screen-xl px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 text-sm text-gray-600 hover:text-black">
            <ChevronLeftIcon className="w-5 h-5" />
            العودة
        </button>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <ImageGallery images={selectedColor.images} />
          </div>

          <div className="sticky top-24 self-start">
             {mainCategory && subCategory && (
                <div className="text-sm text-gray-500 mb-2">
                    <Link to={`/shop?main_cat=${mainCategory.id}`} className="hover:underline">{mainCategory.name}</Link>
                    <span className="mx-2">/</span>
                    <Link to={`/shop?sub_cat=${subCategory.id}`} className="hover:underline">{subCategory.name}</Link>
                </div>
            )}
            <h1 className="text-2xl font-bold lg:text-3xl">{product.name}</h1>
            <p className="mt-2 text-lg text-gray-900">
                {product.originalPrice && <span className="line-through text-gray-400 mr-2">{product.originalPrice} جنيه</span>}
                {product.price} جنيه
            </p>
            <p className="mt-4 text-gray-600">{product.description}</p>
            
            {product.colorVariants.length > 1 && (
                <div className="mt-8">
                    <h2 className="text-sm font-medium text-gray-900">اللون: <span className="font-bold">{selectedColor.name}</span></h2>
                    <fieldset className="mt-4">
                        <legend className="sr-only">اختر لون</legend>
                        <div className="flex flex-wrap gap-2">
                            {product.colorVariants.map((variant, index) => (
                                <label key={variant.name} htmlFor={`color_${index}`} className="cursor-pointer">
                                <input type="radio" id={`color_${index}`} name="color" value={index} className="sr-only" checked={selectedColorIndex === index} onChange={() => setSelectedColorIndex(index)} />
                                <span className={`block h-8 w-8 rounded-full border border-gray-300 ${selectedColorIndex === index ? 'ring-2 ring-offset-1 ring-black' : ''}`} style={{ backgroundColor: variant.colorCode }}></span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </div>
            )}
            
            <div className="mt-8">
                <h2 className="text-sm font-medium text-gray-900">المقاس</h2>
                {product.sizes.length > 1 ? (
                    <fieldset className="mt-4">
                        <legend className="sr-only">اختر مقاس</legend>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map(size => (
                                <div key={size}>
                                    <input type="radio" name="Size" value={size} id={`size_${size}`} className="sr-only" checked={selectedSize === size} onChange={() => setSelectedSize(size)} />
                                    <label htmlFor={`size_${size}`} className={`cursor-pointer block rounded-md border py-2 px-4 text-sm font-medium ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                                        {size}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </fieldset>
                ) : (
                    <p className="mt-2 text-gray-700">{product.sizes[0]}</p>
                )}
            </div>

            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-black px-8 py-3 text-white transition hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.isAvailable ? <><ShoppingCartIcon className="w-5 h-5" /><span className="text-sm font-medium">أضف إلى السلة</span></> : 'غير متاح حاليًا'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;