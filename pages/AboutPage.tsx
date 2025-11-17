import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-3xl font-bold text-black sm:text-4xl">
              عن Medusa
            </h1>
            <p className="mt-4 text-gray-600">
              Medusa ليست مجرد علامة تجارية، بل هي وجهة لكل من يبحث عن الأناقة والجودة في عالم الموضة في مصر. تأسست Medusa بشغف لتقديم أحدث التصاميم العصرية التي تجمع بين الأصالة والمعاصرة، لتناسب ذوق المرأة والرجل العصري.
            </p>
            <p className="mt-4 text-gray-600">
              نحن نؤمن بأن الأناقة تكمن في التفاصيل، لذلك نحرص على اختيار أفضل الخامات وتقديم منتجات ذات جودة عالية تدوم طويلاً. من الملابس والأحذية إلى الشنط والإكسسوارات، كل قطعة في مجموعتنا يتم اختيارها بعناية لتعكس شخصيتك وتمنحك إطلالة فريدة.
            </p>
            <h2 className="mt-8 text-2xl font-bold text-black">رؤيتنا</h2>
            <p className="mt-2 text-gray-600">
              نسعى في Medusa لنكون الخيار الأول للموضة في مصر، من خلال توفير تجربة تسوق استثنائية تجمع بين الجودة العالية، الأسعار التنافسية، وخدمة العملاء المميزة.
            </p>
          </div>
          <div className="hidden lg:block">
            <img
              alt="About Medusa"
              src="https://picsum.photos/seed/about/800/1000"
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;