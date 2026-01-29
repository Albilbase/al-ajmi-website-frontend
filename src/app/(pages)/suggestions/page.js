"use client";
import React from 'react'; // Import React
import { motion } from 'framer-motion'; // Import framer-motion for animations
import { useTranslation } from 'react-i18next'; // Import i18next for translation
import { ChevronDown } from 'lucide-react'; // Import ChevronDown icon
import styles from './suggestions.module.css'; // Import the CSS module

const SuggestionsPage = () => {
  const { t, i18n } = useTranslation(); // Define the translation hook
  const isRTL = i18n.language === 'ar'; // Define the isRTL variable

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Suggestion sent! (This is a demo)");
  };

  const renderInput = (name, type = "text", required = true) => (
    <div className={styles.inputWrapper}>
      <input 
        type={type} 
        id={name}
        className={styles.input} 
        required={required} 
        placeholder=" "
      />
      <label htmlFor={name} className={styles.label}>
        {t(`suggestionsPage.form.${name}`)}
      </label>
    </div>
  );

  return (
    <div className={styles.suggestionsSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/complementbanner.jpeg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>{t('suggestionsPage.title')}</h1>
          <p className={styles.subtitle}>{t('suggestionsPage.subtitle')}</p>
        </motion.div>
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.formCard}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form className={styles.formGrid} onSubmit={handleSubmit}>
            
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <select 
                  id="type" 
                  className={styles.select} 
                  required 
                  defaultValue=""
                >
                  <option value="" disabled></option>
                  <option value="suggestion">{t('suggestionsPage.form.typeOptions.suggestion')}</option>
                  <option value="complaint">{t('suggestionsPage.form.typeOptions.complaint')}</option>
                </select>
                <label htmlFor="type" className={styles.label}>{t('suggestionsPage.form.type')}</label>
                <ChevronDown size={16} style={{position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', opacity:0.5}}/>
              </div>
            </div>

            <div className={styles.formGroup}>{renderInput("name")}</div>
            <div className={styles.formGroup}>{renderInput("mobile", "tel")}</div>
            <div className={styles.formGroup}>{renderInput("email", "email")}</div>
            <div className={styles.formGroup}>{renderInput("subject")}</div>

            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <textarea 
                  id="message"
                  className={styles.textarea} 
                  required 
                  placeholder=" "
                />
                <label htmlFor="message" className={styles.label}>
                  {t('suggestionsPage.form.message')}
                </label>
              </div>
            </div>

            <div className={styles.buttonWrapper}>
              <button type="submit" className={styles.submitButton}>
                <span>{t('suggestionsPage.form.submit')}</span>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SuggestionsPage;
