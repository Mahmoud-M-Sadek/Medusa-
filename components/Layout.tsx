import React, { useState, useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { MenuIcon, XIcon, FacebookIcon, InstagramIcon, WhatsAppIcon, ShoppingCartIcon } from './Icons';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../types';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, cart } = useContext(AppContext) as AppContextType;
    
    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const navItems = [
        { name: 'الرئيسية', path: '/' },
        { name: 'المتجر', path: '/shop' },
        { name: 'من نحن', path: '/about' },
        { name: 'تواصل معنا', path: '/contact' },
    ];

    if (isLoggedIn) {
        navItems.push({ name: 'لوحة التحكم', path: '/admin/dashboard' });
    }

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12">
                        <Link className="block text-black" to="/">
                            <span className="sr-only">Home</span>
                            <span className="text-2xl font-bold">MEDUSA</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <nav aria-label="Global">
                            <ul className="flex items-center gap-6 text-sm">
                                {navItems.map(item => (
                                    <li key={item.name}>
                                        <NavLink
                                            className={({ isActive }) => `text-black transition hover:text-gray-500/75 ${isActive ? 'underline underline-offset-4' : ''}`}
                                            to={item.path}
                                        >
                                            {item.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 text-black hover:opacity-75">
                            <ShoppingCartIcon />
                            {totalCartItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                                    {totalCartItems}
                                </span>
                            )}
                        </Link>
                        <div className="block md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                            >
                                {isOpen ? <XIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <nav className="p-4">
                        <ul className="flex flex-col items-center gap-4 text-sm">
                           {navItems.map(item => (
                                <li key={item.name}>
                                    <NavLink
                                        className={({ isActive }) => `text-black transition hover:text-gray-500/75 ${isActive ? 'underline underline-offset-4' : ''}`}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between text-center">
            <div className="flex justify-center sm:justify-start">
               <span className="text-2xl font-bold">MEDUSA</span>
            </div>
             <div className="flex justify-center gap-6 sm:justify-start md:gap-8 mt-4 sm:mt-0">
                <a href="https://www.facebook.com/share/16x7iyE5ck/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="hover:opacity-75"><FacebookIcon /></a>
                <a href="https://www.instagram.com/m0dessa" target="_blank" rel="noreferrer" className="hover:opacity-75"><InstagramIcon /></a>
                <a href="https://wa.me/201555414422" target="_blank" rel="noreferrer" className="hover:opacity-75"><WhatsAppIcon /></a>
            </div>
            <p className="mt-4 text-center text-sm lg:mt-0 lg:text-right">
                &copy; {new Date().getFullYear()} Medusa. جميع الحقوق محفوظة.
            </p>
        </div>
      </div>
    </footer>
  );
};


const Layout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;