"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Phone, Mail, MapPin, Clock, 
  Printer
} from 'lucide-react';
import styles from './contact.module.css';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! (This is a demo)");
  };

  const branches = [
    {
      key: 'riyadh',
      mapLink: "https://maps.app.goo.gl/teUEk4VMhiivjCZP9" 
    },
    {
      key: 'jazan',
      mapLink: "https://maps.app.goo.gl/teUEk4VMhiivjCZP9"
    },
    {
      key: 'hofuf',
      mapLink: "https://maps.app.goo.gl/teUEk4VMhiivjCZP9"
    }
  ];

  return (
    <div className={styles.contactSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/contactusbanner.webp')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>{t('contactPage.title')}</h1>
          <p className={styles.subtitle}>{t('contactPage.subtitle')}</p>
        </motion.div>
      </div>

      <div className={styles.container}>
        {/* Main Grid: Form + Main Info */}
        <div className={styles.contentGrid}>
          
          {/* Contact Form */}
          <motion.div 
            className={styles.formCard}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.formTitle}>{t('contactPage.form.title')}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('contactPage.form.fullName')}</label>
                <input type="text" className={styles.input} required />
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('contactPage.form.mobile')}</label>
                  <input type="tel" className={styles.input} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('contactPage.form.email')}</label>
                  <input type="email" className={styles.input} required />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t('contactPage.form.subject')}</label>
                <input type="text" className={styles.input} required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t('contactPage.form.message')}</label>
                <textarea className={styles.textarea} required></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                {t('contactPage.form.submit')}
              </button>
            </form>
          </motion.div>

          {/* Side Info Panel */}
          <motion.div 
            className={styles.infoCard}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.infoSection}>
              <h3 className={styles.infoTitle}>{t('contactPage.info.title')}</h3>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Phone size={20} /></div>
                <div className={styles.infoText}>
                  <p dir="ltr">{t('contactPage.info.phone')}</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Mail size={20} /></div>
                <div className={styles.infoText}>
                  <p>{t('contactPage.info.email')}</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Clock size={20} /></div>
                <div className={styles.infoText}>
                  <p>{t('contactPage.info.hours.saturday')}</p>
                  <p>{t('contactPage.info.hours.weekdays')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Branches Section */}
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center' }}>
            {t('contactPage.info.branchesTitle')}
          </h2>
          
          <div className={styles.branchesGrid}>
            {branches.map((branch) => (
              <div key={branch.key} className={styles.branchCard}>
                <h4 className={styles.branchName}>{t(`contactPage.info.branches.${branch.key}.name`)}</h4>
                
                <div className={styles.branchDetail}>
                   <MapPin size={18} className="text-primary" />
                   <span>{t(`contactPage.info.branches.${branch.key}.address`)}</span>
                </div>
                
                <div className={styles.branchDetail}>
                   <Phone size={18} className="text-primary" />
                   <span dir="ltr">{t('contactPage.info.phone')}</span>
                </div>

                <div className={styles.branchDetail}>
                   <Printer size={18} className="text-primary" />
                   <span dir="ltr">{t(`contactPage.info.branches.${branch.key}.fax`)}</span>
                </div>

                <div className={styles.branchDetail}>
                   <Mail size={18} className="text-primary" />
                   <span>{t(`contactPage.info.branches.${branch.key}.poBox`)}</span>
                </div>

                {/* Embedded Google Map */}
                <div className={styles.mapContainer}>
                  <iframe 
                    src="https://maps.google.com/maps?q=24.8049998,46.7990096&height=400&hl=en&z=17&output=embed"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
