import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../types';
import { TruckIcon, ShieldCheckIcon, HeadphonesIcon, StarIcon, QuoteIcon } from '../components/Icons';

const HeroSection: React.FC = () => (
  <section className="relative bg-black bg-cover bg-center bg-no-repeat h-screen flex items-center" style={{ backgroundImage: "url(https://picsum.photos/seed/hero/1920/1080)" }}>
    <div className="absolute inset-0 bg-black/60"></div>
    <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:px-8 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
          أناقتك تبدأ من هنا
          <strong className="block font-extrabold mt-2"> MODESSA Style </strong>
        </h1>

        <p className="mt-6 max-w-lg mx-auto text-white/90 sm:text-xl/relaxed">
          اكتشف أحدث صيحات الموضة من ملابس، شنط، أحذية وإكسسوارات. جودة عالية وتصاميم عصرية تناسب ذوقك.
        </p>

        <div className="mt-8">
          <Link
            to="/shop"
            className="inline-block w-full rounded-md border border-white bg-white px-12 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white focus:outline-none focus:ring sm:w-auto"
          >
            تسوق الآن
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const CategorySection: React.FC = () => {
    const { mainCategories } = useContext(AppContext) as AppContextType;
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <header className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">تصفح الأقسام الرئيسية</h2>
                    <p className="mx-auto mt-4 max-w-md text-gray-500">
                        كل ما تحتاجه لإطلالة متكاملة في مكان واحد.
                    </p>
                </header>

                <ul className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2">
                    {mainCategories.map((category) => (
                        <li key={category.id}>
                             <Link to={`/shop?main_cat=${category.id}`} className="group relative block">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="aspect-square w-full object-cover transition duration-500 group-hover:opacity-90 rounded-lg"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black bg-opacity-60 rounded-lg">
                                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

const PopularSubcategoriesSection: React.FC = () => {
    const { subcategories } = useContext(AppContext) as AppContextType;
    // For demonstration, we'll just pick a few popular ones. In a real app, this would be dynamic.
    const popular = subcategories.filter(sc => ['s1', 's4', 's6'].includes(sc.id));
    if(popular.length === 0) return null;
    
    const subCatImages: {[key: string]: string} = {
        's1': 'https://picsum.photos/seed/subcat1/600/600',
        's4': 'https://picsum.photos/seed/subcat2/600/600',
        's6': 'https://picsum.photos/seed/subcat3/600/600',
    };

    return (
        <section className="bg-gray-50">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <header className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">الأقسام الأكثر رواجًا</h2>
                </header>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {popular.map(subcat => (
                         <Link key={subcat.id} to={`/shop?sub_cat=${subcat.id}`} className="group relative block overflow-hidden rounded-lg">
                             <img src={subCatImages[subcat.id]} alt={subcat.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                 <h3 className="text-white text-2xl font-bold">{subcat.name}</h3>
                             </div>
                         </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

const FeaturedItemsSection: React.FC = () => {
    const { products } = useContext(AppContext) as AppContextType;
    const featured = products.filter(p => p.isFeatured && p.isAvailable).slice(0, 4);
    if(featured.length === 0) return null;
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">منتجات مميزة</h2>
                    <p className="mx-auto mt-4 max-w-md text-gray-500">
                        قطع فريدة اخترناها لك بعناية.
                    </p>
                </div>
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {featured.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

const BestSellersSection: React.FC = () => {
    const { products } = useContext(AppContext) as AppContextType;
    const bestSellers = products.filter(p => p.isBestSeller && p.isAvailable).slice(0, 4);
    if(bestSellers.length === 0) return null;
    return (
        <section className="bg-gray-50">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">الأكثر مبيعًا</h2>
                    <p className="mx-auto mt-4 max-w-md text-gray-500">
                        منتجاتنا التي نالت إعجاب عملائنا.
                    </p>
                </div>
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {bestSellers.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const SalesSection: React.FC = () => {
    const { products } = useContext(AppContext) as AppContextType;
    const onSale = products.filter(p => p.originalPrice && p.isAvailable).slice(0, 4);
    if(onSale.length === 0) return null;
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">عروض وخصومات</h2>
                    <p className="mx-auto mt-4 max-w-md text-gray-500">
                       لا تفوت فرصة الحصول على أفضل المنتجات بأفضل الأسعار.
                    </p>
                </div>
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {onSale.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

const FeaturesSection: React.FC = () => {
    const features = [
        { icon: <TruckIcon className="h-10 w-10 text-black" />, title: 'شحن سريع', description: 'توصيل سريع لكل محافظات مصر.' },
        { icon: <ShieldCheckIcon className="h-10 w-10 text-black" />, title: 'جودة عالية', description: 'نضمن لك أفضل الخامات والتصنيع.' },
        { icon: <HeadphonesIcon className="h-10 w-10 text-black" />, title: 'دعم فني', description: 'متواجدون لمساعدتك على مدار الساعة.' },
        { icon: <StarIcon className="h-10 w-10 text-black" />, title: 'تجربة فريدة', description: 'تجربة تسوق سهلة وممتعة.' },
    ];
    return(
        <section className="bg-gray-50">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">لماذا تختار MODESSA؟</h2>
                 </div>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
                    {features.map(feature => (
                        <div key={feature.title} className="flex flex-col items-center p-4">
                            {feature.icon}
                            <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                            <p className="mt-1 text-gray-500">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const TestimonialsSection: React.FC = () => {
    const testimonials = [
        { name: 'سارة أحمد', quote: 'جودة المنتجات ممتازة والتوصيل كان سريع جدًا. تجربة رائعة بالتأكيد سأكررها.' },
        { name: 'محمد علي', quote: 'تصاميم عصرية وفريدة، والمقاسات كانت مظبوطة تمامًا. شكرًا MODESSA.' },
        { name: 'فاطمة حسن', quote: 'خدمة العملاء كانت متعاونة جدًا وساعدوني في اختيار المنتج المناسب. أنصح به بشدة.' },
    ];
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">آراء عملائنا</h2>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map(t => (
                        <div key={t.name} className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                            <QuoteIcon className="h-8 w-8 mx-auto text-gray-300" />
                            <p className="mt-4 text-gray-700">{t.quote}</p>
                            <p className="mt-6 font-bold">{t.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const GallerySection: React.FC = () => {
    const images = [
        "https://picsum.photos/seed/gallery1/600/800",
        "https://picsum.photos/seed/gallery2/600/800",
        "https://picsum.photos/seed/gallery3/600/800",
        "https://picsum.photos/seed/gallery4/600/800",
    ];
    return (
        <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">#MODESSAStyle</h2>
                    <p className="mx-auto mt-4 max-w-md text-gray-500">
                        إطلالات ملهمة من مجتمعنا.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {images.map((src, index) => (
                        <div key={index} className="overflow-hidden rounded-lg">
                            <img src={src} alt={`Gallery image ${index + 1}`} className="h-full w-full object-cover transition duration-300 hover:scale-110" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const CtaSection: React.FC = () => (
    <section className="bg-black">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                <div className="lg:py-12 text-center lg:text-right">
                    <h2 className="text-3xl font-bold sm:text-4xl text-white">جاهز لتحديث إطلالتك؟</h2>
                    <p className="mt-4 text-gray-300">
                        تصفح مجموعتنا الكاملة الآن واكتشف القطع التي ستعبر عنك.
                    </p>
                </div>
                <div className="text-center">
                     <Link to="/shop" className="inline-block rounded-md border border-white bg-white px-12 py-3 text-sm font-medium text-black transition hover:bg-transparent hover:text-white focus:outline-none focus:ring">
                        ابدأ التسوق
                    </Link>
                </div>
            </div>
        </div>
    </section>
)

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <PopularSubcategoriesSection />
      <FeaturedItemsSection />
      <BestSellersSection />
      <SalesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <GallerySection />
      <CtaSection />
    </>
  );
};

export default HomePage;