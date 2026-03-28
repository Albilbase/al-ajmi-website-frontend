"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import styles from './login.module.css';
import { toast } from 'react-toastify';
import { loginAPI } from '@/lib/api';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const expired = sessionStorage.getItem('session_expired');
      if (expired === 'true') {
        const message = i18n?.language === 'ar' 
          ? 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى' 
          : 'Session expired. Please log in again.';
        toast.info(message);
        sessionStorage.removeItem('session_expired');
      }
    }
  }, [i18n?.language]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await loginAPI({ email, password });
      // The token is already stored inside loginAPI, but we can use the back-end message if available
      toast.success(data?.message || 'تم تسجيل الدخول بنجاح');
      router.push('/dashboard');
    } catch (error) {
      // Use a generic message for security (don't reveal if account exists or password is wrong)
      const genericMessage = i18n?.language === 'ar' 
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.' 
        : 'Invalid email or password. Please try again.';
      toast.error(genericMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={styles.loginCard}
      >
        <div className={styles.logoWrapper}>
          <div style={{ position: 'relative', width: '150px', height: '60px' }}>
            <Image 
              src="/logo.png" 
              alt="Alajmi Company" 
              fill 
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        <div className={styles.header}>
          <h1>Admin Portal</h1>
          <p>Sign in to manage your company's presence</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input 
                type="email" 
                placeholder="admin@alajmi.com" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '1rem', 
                  background: 'none', 
                  border: 'none', 
                  color: '#94a3b8', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className={styles.forgotPassword}>Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          Secure access for authorized personnel only. 
          <br />
          Need help? <a href="mailto:support@alajmi.com">Contact IT Department</a>
        </div>
      </motion.div>
    </div>
  );
}
