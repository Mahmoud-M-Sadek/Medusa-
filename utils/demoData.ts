import type { Product, MainCategory, Subcategory, Order } from '../types';

export const initialMainCategories: MainCategory[] = [
    { id: 1, name: 'ملابس', image: 'https://picsum.photos/seed/cat1/500/500' },
    { id: 2, name: 'شنط', image: 'https://picsum.photos/seed/cat2/500/500' },
    { id: 3, name: 'أحذية', image: 'https://picsum.photos/seed/cat3/500/500' },
    { id: 4, name: 'إكسسوارات', image: 'https://picsum.photos/seed/cat4/500/500' },
];

export const initialSubcategories: Subcategory[] = [
    { id: 1, name: 'فساتين', mainCategoryId: 1 },
    { id: 2, name: 'تيشرتات', mainCategoryId: 1 },
    { id: 3, name: 'بناطيل', mainCategoryId: 1 },
    { id: 4, name: 'شنط كروس', mainCategoryId: 2 },
    { id: 5, name: 'شنط ظهر', mainCategoryId: 2 },
    { id: 6, name: 'أحذية رياضية', mainCategoryId: 3 },
    { id: 7, name: 'صنادل', mainCategoryId: 3 },
    { id: 8, name: 'نظارات شمسية', mainCategoryId: 4 },
];

export const initialProducts: Product[] = [
    {
        id: 1,
        name: 'فستان صيفي أنيق',
        description: 'فستان صيفي خفيف ومريح بتصميم عصري يناسب جميع المناسبات.',
        price: 750,
        originalPrice: 900,
        subCategoryId: 1,
        isAvailable: true,
        isBestSeller: true,
        isFeatured: true,
        colorVariants: [
            { name: 'أزرق سماوي', colorCode: '#87CEEB', images: ['https://picsum.photos/seed/p1-c1-i1/800/800', 'https://picsum.photos/seed/p1-c1-i2/800/800'] },
            { name: 'وردي فاتح', colorCode: '#FFB6C1', images: ['https://picsum.photos/seed/p1-c2-i1/800/800'] },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
    },
    {
        id: 2,
        name: 'تيشرت قطني بيزك',
        description: 'تيشرت قطني 100% عملي ومريح للاستخدام اليومي.',
        price: 350,
        subCategoryId: 2,
        isAvailable: true,
        isBestSeller: true,
        colorVariants: [
            { name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p2-c1-i1/800/800'] },
            { name: 'أبيض', colorCode: '#FFFFFF', images: ['https://picsum.photos/seed/p2-c2-i1/800/800'] },
        ],
        sizes: ['M', 'L', 'XL'],
    },
    {
        id: 3,
        name: 'شنطة كروس جلد',
        description: 'شنطة كروس أنيقة من الجلد الصناعي عالي الجودة بحجم مثالي.',
        price: 550,
        subCategoryId: 4,
        isAvailable: true,
        isFeatured: true,
        colorVariants: [
            { name: 'جملي', colorCode: '#D2B48C', images: ['https://picsum.photos/seed/p3-c1-i1/800/800', 'https://picsum.photos/seed/p3-c1-i2/800/800'] },
        ],
        sizes: ['مقاس واحد'],
    },
    {
        id: 4,
        name: 'حذاء رياضي مريح',
        description: 'حذاء رياضي خفيف الوزن ومناسب للمشي والركض.',
        price: 800,
        subCategoryId: 6,
        isAvailable: false,
        isBestSeller: true,
        colorVariants: [
            { name: 'رمادي', colorCode: '#808080', images: ['https://picsum.photos/seed/p4-c1-i1/800/800'] },
        ],
        sizes: ['38', '39', '40', '41', '42'],
    },
     {
        id: 5,
        name: 'بنطلون جينز واسع',
        description: 'بنطلون جينز بقصة واسعة ومريحة، مثالي للإطلالات الكاجوال.',
        price: 650,
        originalPrice: 800,
        subCategoryId: 3,
        isAvailable: true,
        isFeatured: true,
        colorVariants: [
            { name: 'أزرق فاتح', colorCode: '#ADD8E6', images: ['https://picsum.photos/seed/p5-c1-i1/800/800'] }
        ],
        sizes: ['28', '30', '32', '34'],
    },
    {
        id: 6,
        name: 'نظارة شمسية كلاسيكية',
        description: 'نظارة شمسية بتصميم كلاسيكي توفر حماية كاملة من أشعة الشمس.',
        price: 450,
        subCategoryId: 8,
        isAvailable: true,
        isBestSeller: true,
        colorVariants: [
            { name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p6-c1-i1/800/800'] }
        ],
        sizes: ['مقاس واحد'],
    },
];

export const initialOrders: Order[] = [];