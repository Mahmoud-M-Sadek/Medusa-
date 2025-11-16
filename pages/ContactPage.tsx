import React from 'react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '../components/Icons';

const ContactPage: React.FC = () => {
    const contactLinks = [
        { Icon: WhatsAppIcon, name: 'واتساب', href: 'https://wa.me/201555414422', handle: '+20 155 541 4422' },
        { Icon: InstagramIcon, name: 'إنستجرام', href: '#', handle: '@medusa.eg' },
        { Icon: FacebookIcon, name: 'فيسبوك', href: '#', handle: 'Medusa Egypt' },
    ];
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">تواصل معنا</h1>
          <p className="mt-4 text-gray-500">
            نسعد بتواصلكم معنا عبر قنواتنا المختلفة.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {contactLinks.map(({ Icon, name, href, handle }) => (
            <a
              key={name}
              className="block rounded-xl border border-gray-200 p-8 shadow-sm transition hover:border-black hover:shadow-lg"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="h-10 w-10 text-black" />
              <h2 className="mt-4 text-xl font-bold text-black">{name}</h2>
              <p className="mt-1 text-sm text-gray-500">{handle}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;