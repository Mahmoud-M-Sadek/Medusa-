import type { Product, MainCategory, Subcategory, Order } from '../types';

export const demoMainCategories: MainCategory[] = [
    { id: 1, name: 'ملابس', image: 'https://picsum.photos/seed/cat1/600/600' },
    { id: 2, name: 'شنط', image: 'https://picsum.photos/seed/cat2/600/600' },
    { id: 3, name: 'أحذية', image: 'https://picsum.photos/seed/cat3/600/600' },
    { id: 4, name: 'إكسسوارات', image: 'https://picsum.photos/seed/cat4/600/600' },
];

export const demoSubcategories: Subcategory[] = [
    { id: 1, name: 'فساتين', mainCategoryId: 1 },
    { id: 2, name: 'بناطيل', mainCategoryId: 1 },
    { id: 3, name: 'بلوزات', mainCategoryId: 1 },
    { id: 4, name: 'شنط كروس', mainCategoryId: 2 },
    { id: 5, name: 'شنط ظهر', mainCategoryId: 2 },
    { id: 6, name: 'أحذية رياضية', mainCategoryId: 3 },
    { id: 7, name: 'أحذية كلاسيك', mainCategoryId: 3 },
    { id: 8, name: 'نظارات شمسية', mainCategoryId: 4 },
];

export const demoProducts: Product[] = [
    {
        id: 1,
        name: 'فستان صيفي مورد',
        description: 'فستان أنيق ومريح لفصل الصيف بألوان زاهية وتصميم فريد يناسب جميع المناسبات.',
        price: 450,
        originalPrice: 600,
        subCategoryId: 1,
        isAvailable: true,
        isBestSeller: true,
        isFeatured: true,
        colorVariants: [
            { name: 'أزرق', colorCode: '#2563eb', images: ['https://picsum.photos/seed/p1c1i1/800/800', 'https://picsum.photos/seed/p1c1i2/800/800', 'https://picsum.photos/seed/p1c1i3/800/800'] },
            { name: 'أحمر', colorCode: '#dc2626', images: ['https://picsum.photos/seed/p1c2i1/800/800'] }
        ],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 2,
        name: 'بنطلون جينز واسع',
        description: 'بنطلون جينز بقصة واسعة يوفر الراحة والأناقة لإطلالة عصرية.',
        price: 550,
        subCategoryId: 2,
        isAvailable: true,
        isBestSeller: true,
        isFeatured: false,
        colorVariants: [
            { name: 'أزرق فاتح', colorCode: '#60a5fa', images: ['https://picsum.photos/seed/p2c1i1/800/800', 'https://picsum.photos/seed/p2c1i2/800/800'] }
        ],
        sizes: ['30', '32', '34', '36']
    },
    {
        id: 3,
        name: 'شنطة كروس جلد',
        description: 'شنطة كروس مصنوعة من الجلد الطبيعي بحجم مثالي للاستخدام اليومي.',
        price: 700,
        subCategoryId: 4,
        isAvailable: false,
        isBestSeller: false,
        isFeatured: true,
        colorVariants: [
            { name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p3c1i1/800/800'] },
            { name: 'بني', colorCode: '#78350f', images: ['https://picsum.photos/seed/p3c2i1/800/800'] }
        ],
        sizes: ['مقاس واحد']
    },
    {
        id: 4,
        name: 'حذاء رياضي أبيض',
        description: 'حذاء رياضي مريح بتصميم كلاسيكي يناسب جميع الأنشطة.',
        price: 650,
        subCategoryId: 6,
        isAvailable: true,
        isBestSeller: false,
        isFeatured: false,
        colorVariants: [
            { name: 'أبيض', colorCode: '#FFFFFF', images: ['https://picsum.photos/seed/p4c1i1/800/800'] }
        ],
        sizes: ['40', '41', '42', '43', '44']
    },
    {
        id: 5,
        name: 'بلوزة ساتان ناعمة',
        description: 'بلوزة من قماش الساتان الناعم بتصميم أنيق يناسب السهرات.',
        price: 350,
        subCategoryId: 3,
        isAvailable: true,
        isBestSeller: false,
        isFeatured: true,
        colorVariants: [
            { name: 'شمبانيا', colorCode: '#f7e9d8', images: ['https://picsum.photos/seed/p5c1i1/800/800'] }
        ],
        sizes: ['M', 'L']
    },
     {
        id: 6,
        name: 'نظارة شمسية عصرية',
        description: 'نظارة شمسية بإطار أسود لحماية كاملة من أشعة الشمس.',
        price: 300,
        originalPrice: 400,
        subCategoryId: 8,
        isAvailable: true,
        isBestSeller: false,
        isFeatured: false,
        colorVariants: [
            { name: 'أسود', colorCode: '#000000', images: ['https://picsum.photos/seed/p6c1i1/800/800'] }
        ],
        sizes: ['مقاس واحد']
    },
];

export const demoOrders: Order[] = [];