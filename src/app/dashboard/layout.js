
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
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdowns, setOpenDropdowns] = useState({
    home: true,
    company: false,
    media: false
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Check for authentication
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
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

  return (
    <div className={styles.dashboardContainer} dir="ltr">
      {/* Sidebar */}
      <aside className={styles.sidebar} style={{ width: isSidebarOpen ? '280px' : '90px' }}>
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
              <Link key={link.path} href={link.path} className={`${styles.navLink} ${isActive(link.path) ? styles.navLinkActive : ''}`}>
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
                      <Link key={link.path} href={link.path} className={`${styles.dropdownLink} ${isActive(link.path) ? styles.dropdownLinkActive : ''}`}>
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
                      <Link key={link.path} href={link.path} className={`${styles.dropdownLink} ${isActive(link.path) ? styles.dropdownLinkActive : ''}`}>
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
                      <Link key={link.path} href={link.path} className={`${styles.dropdownLink} ${isActive(link.path) ? styles.dropdownLinkActive : ''}`}>
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
              <Link key={link.path} href={link.path} className={`${styles.navLink} ${isActive(link.path) ? styles.navLinkActive : ''}`}>
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
            <button onClick={toggleSidebar} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', padding: '0.6rem', borderRadius: '10px', display: 'flex', alignItems: 'center', color: '#1e293b' }}>
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <h1 className={styles.navbarTitle}>
              {pathname === '/dashboard' ? 'Overview' : pathname.split('/').pop().replace(/-/g, ' ').toUpperCase()}
            </h1>
          </div>

          <div className={styles.navbarRight}>
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
