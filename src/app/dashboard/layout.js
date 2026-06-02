
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  ChevronDown, 
  Bell, 
  LogOut, 
  Search,
  Layers,
  ImageIcon,
  Briefcase,
  Trophy,
  Handshake,
  ChevronLeft,
  ChevronRight,
  Info,
  HardHat,
  Monitor,
  Mail,
  Truck,
  UserPlus,
  MessageSquare,
  FileText,
  Menu,
  X as CloseIcon,
  Clock,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './dashboard.module.css';
import { confirmAction } from '@/lib/sweetalert';


export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdowns, setOpenDropdowns] = useState({
    home: true,
    company: false,
    media: false
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    const result = await confirmAction('تسجيل الخروج', 'هل أنت متأكد من رغبتك في تسجيل الخروج؟', 'تسجيل الخروج');
    if (result.isConfirmed) {
      sessionStorage.removeItem('token');
      router.push('/login');
    }
  };


  // Check for authentication and set expiry timer
  React.useEffect(() => {
    let logoutTimer;
    let intervalId;
    
    // Function to handle logout and notification
    const logoutUser = () => {
      sessionStorage.removeItem('token');
      sessionStorage.setItem('session_expired', 'true');
      router.push('/login');
    };

    // Helper to decode JWT
    const decodeToken = (token) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
    };

    // Format seconds into MM:SS
    const formatTime = (ms) => {
      const totalSeconds = Math.floor(ms / 1000);
      if (totalSeconds <= 0) return "00:00";
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const token = sessionStorage.getItem('token');
    if (!token) {
      logoutUser();
    } else {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp) {
        const calculateRemaining = () => {
           const currentTime = Date.now();
           const expiryTime = decoded.exp * 1000;
           return expiryTime - currentTime;
        };

        const initialRemaining = calculateRemaining();
        if (initialRemaining <= 0) {
          logoutUser();
        } else {
          setIsCheckingAuth(false);
          setTimeLeft(formatTime(initialRemaining));
          
          // Set timer to log out when token expires
          logoutTimer = setTimeout(() => {
            logoutUser();
          }, initialRemaining);

          // Update the UI countdown every second
          intervalId = setInterval(() => {
            const rem = calculateRemaining();
            if (rem <= 0) {
              clearInterval(intervalId);
              logoutUser();
            } else {
              setTimeLeft(formatTime(rem));
            }
          }, 1000);
        }
      } else {
        logoutUser();
      }
    }

    // Cleanup timers on unmount
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [router]);

  const isActive = (path) => pathname === path;
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const toggleDropdown = (key) => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setOpenDropdowns(prev => ({ ...prev, [key]: true }));
    } else {
      setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const menuItems = {
    general: [
      { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    ],
    homeContent: [
      { name: 'Hero Section', path: '/dashboard/sections/home/hero' },
      { name: 'Company Introduction', path: '/dashboard/sections/home/history' },
      { name: 'Services Section', path: '/dashboard/sections/home/services' },
      { name: 'Projects Section', path: '/dashboard/sections/home/projects' },
      { name: 'Awards', path: '/dashboard/sections/home/awards' },
      { name: 'Partners', path: '/dashboard/sections/home/partners' },
      { name: 'Videos', path: '/dashboard/sections/home/videos' },
      { name: 'News Ticker', path: '/dashboard/sections/home/news-ticker' },
    ],
    company: [
      { name: 'About Us', path: '/dashboard/sections/company/about' },
      { name: 'Why Ajami', path: '/dashboard/sections/company/why-ajami' },
      { name: 'Company Vision', path: '/dashboard/sections/company/vision' },
      { name: 'Board of Directors', path: '/dashboard/sections/company/board' },
      { name: 'HSE Policy', path: '/dashboard/sections/company/hse' },
    ],
    media: [
      { name: 'Media Items', path: '/dashboard/sections/media/items' },
      { name: 'Newspaper', path: '/dashboard/sections/media/news' },
      { name: 'Gallery', path: '/dashboard/sections/media/gallery' },
    ],
    pages: [
      { name: 'Our Projects', icon: Layers, path: '/dashboard/sections/projects' },
      { name: 'Our Services', icon: Briefcase, path: '/dashboard/sections/home/services' },
      { name: 'Customers', icon: HardHat, path: '/dashboard/sections/home/projects' },
      { name: 'Suppliers', icon: Truck, path: '/dashboard/sections/suppliers' },
      { name: 'Jobs', icon: UserPlus, path: '/dashboard/sections/jobs' },
      { name: 'Suggestions', icon: MessageSquare, path: '/dashboard/sections/suggestions' },
      { name: 'Footer', icon: FileText, path: '/dashboard/sections/footer' },
      { name: 'Contact Us', icon: Mail, path: '/dashboard/sections/contact' },
    ]
  };

  if (isCheckingAuth) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        background: '#ffffff',
      }}>
        <Loader2 size={40} color="#DC143C" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer} dir="ltr">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className={styles.mobileBackdrop}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpenMobile : ''}`} 
        style={{ width: isSidebarOpen ? '280px' : '90px' }}
      >
        <div className={styles.sidebarLogo}>
          <div style={{ position: 'relative', width: isSidebarOpen ? '160px' : '50px', height: '60px' }}>
            <Image src="/logo.png" alt="Alajmi Logo" fill style={{ objectFit: 'contain' }} priority />
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {/* General */}
          <div className={styles.navGroup}>
            {isSidebarOpen && <div className={styles.navLabel}>System</div>}
            {menuItems.general.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`${styles.navLink} ${isActive(link.path) ? styles.navLinkActive : ''}`}
                onClick={closeMobileMenu}
              >
                <link.icon size={20} />
                {isSidebarOpen && <span>{link.name}</span>}
              </Link>
            ))}
          </div>

          {/* Home Content Dropdown */}
          <div className={styles.navGroup}>
            <div className={styles.dropdownWrapper}>
              <div className={styles.dropdownHeader} onClick={() => toggleDropdown('home')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ImageIcon size={20} />
                  {isSidebarOpen && <span>Home Content</span>}
                </div>
                {isSidebarOpen && <ChevronDown size={14} style={{ transform: openDropdowns.home ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />}
              </div>
              <AnimatePresence>
                {isSidebarOpen && openDropdowns.home && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.dropdownContent}>
                    {menuItems.homeContent.map((link) => (
                      <Link 
                        key={link.path} 
                        href={link.path} 
                        className={`${styles.dropdownLink} ${isActive(link.path) ? styles.dropdownLinkActive : ''}`}
                        onClick={closeMobileMenu}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Company Dropdown */}
          <div className={styles.navGroup}>
            <div className={styles.dropdownWrapper}>
              <div className={styles.dropdownHeader} onClick={() => toggleDropdown('company')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Info size={20} />
                  {isSidebarOpen && <span>Company</span>}
                </div>
                {isSidebarOpen && <ChevronDown size={14} style={{ transform: openDropdowns.company ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />}
              </div>
              <AnimatePresence>
                {isSidebarOpen && openDropdowns.company && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.dropdownContent}>
                    {menuItems.company.map((link) => (
                      <Link 
                        key={link.path} 
                        href={link.path} 
                        className={`${styles.dropdownLink} ${isActive(link.path) ? styles.dropdownLinkActive : ''}`}
                        onClick={closeMobileMenu}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Media Center Dropdown */}
          <div className={styles.navGroup}>
            <div className={styles.dropdownWrapper}>
              <div className={styles.dropdownHeader} onClick={() => toggleDropdown('media')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Monitor size={20} />
                  {isSidebarOpen && <span>Media Center</span>}
                </div>
                {isSidebarOpen && <ChevronDown size={14} style={{ transform: openDropdowns.media ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />}
              </div>
              <AnimatePresence>
                {isSidebarOpen && openDropdowns.media && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={styles.dropdownContent}>
                    {menuItems.media.map((link) => (
                      <Link 
                        key={link.path} 
                        href={link.path} 
                        className={`${styles.dropdownLink} ${isActive(link.path) ? styles.dropdownLinkActive : ''}`}
                        onClick={closeMobileMenu}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Main Pages */}
          <div className={styles.navGroup}>
            {isSidebarOpen && <div className={styles.navLabel}>Direct Management</div>}
            {menuItems.pages.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`${styles.navLink} ${isActive(link.path) ? styles.navLinkActive : ''}`}
                onClick={closeMobileMenu}
              >
                <link.icon size={20} />
                {isSidebarOpen && <span>{link.name}</span>}
              </Link>
            ))}
          </div>

          <div className={styles.navGroup} style={{ marginTop: 'auto' }}>
            <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', color: 'inherit' }}>
              <LogOut size={20} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent} style={{ marginLeft: isSidebarOpen ? '280px' : '90px' }}>
        <header className={styles.navbar}>
          <div className={styles.navbarLeft}>
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className={styles.mobileMenuBtn}
            >
              <Menu size={24} />
            </button>
            <button onClick={toggleSidebar} className={styles.desktopSidebarToggle}>
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <h1 className={styles.navbarTitle}>
              {pathname === '/dashboard' ? 'Overview' : pathname.split('/').pop().replace(/-/g, ' ').toUpperCase()}
            </h1>
          </div>

          <div className={styles.navbarRight}>
            {timeLeft && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  background: '#fef2f2', 
                  border: '1px solid #fee2e2',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  marginRight: '1rem',
                  boxShadow: '0 2px 4px rgba(220, 20, 60, 0.05)',
                  whiteSpace: 'nowrap'
                }}
                title="Remaining session time"
              >
                <Clock size={14} strokeWidth={2.5} />
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expires In:</span>
                <span style={{ fontSize: '0.9rem', fontFamily: 'monospace', minWidth: '45px', textAlign: 'center' }}>{timeLeft}</span>
              </div>
            )}
            <div className={styles.navbarAction}><Search size={18} /></div>
            <div className={styles.navbarAction}><Bell size={18} /></div>
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Administrator</span>
                <span className={styles.userRole}>System Manager</span>
              </div>
              <div className={styles.userAvatar}>AD</div>
            </div>
          </div>
        </header>

        <section className={styles.dashboardBody}>
          <div style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</div>
          <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
            All Rights Reserved &copy; {new Date().getFullYear()} Alajmi Contracting Company
          </footer>
        </section>
      </main>
    </div>
  );
}
