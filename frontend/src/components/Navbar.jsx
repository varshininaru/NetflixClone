import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authUser';
import { LogOut, Menu, Search } from 'lucide-react';
import { useContentStore } from '../store/content';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const { setContentType} = useContentStore();

  
  // ✅ Auto-close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {  // sm breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className='max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20'>
        <div className='flex items-center gap-10 z-50'>
            <Link to={"/"}>
            <img src='/netflix-logo.png' alt='Netflix logo' className='w-32 sm:w-40' />
            </Link>
            <div className='hidden sm:flex gap-2 items-center'>
                <Link to="/" className='hover:underline' onClick={() => setContentType("movie")}>Movies</Link>
                <Link to="/" className='hover:underline' onClick={() => setContentType("tv")}>TV shows</Link>
                <Link to="/history" className='hover:underline'>Search History</Link>
            </div>
        </div>
      <div className='flex gap-2 items-center z-50'>
        <Link to={"/search"}>
        <Search className='size-6 cursor-pointer'/>
        </Link>
        {user && user.image && (
          <img src={user.image} alt='Avatar' className='h-8 rounded cursor-pointer'/>
        )}
        <LogOut className='size-6 cursor-pointer' onClick={logout} />
        <div className='sm:hidden'>
            <Menu className='size-6 cursor-pointer' onClick={toggleMobileMenu} />
        </div>
      </div>
      {isMobileMenuOpen && (
        <div>
            <Link to={"/"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
            Movies
            </Link>
            <Link to={"/"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
            TV Shows
            </Link>
            <Link to={"/history"} className='block hover:underline p-2' onClick={toggleMobileMenu}>
            Search History
            </Link>
        </div>
      )}
    </header>
  )
}

export default Navbar