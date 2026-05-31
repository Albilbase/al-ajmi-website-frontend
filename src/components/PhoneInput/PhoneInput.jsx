'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import styles from './PhoneInput.module.css';

const countries = [
  { nameAr: 'السعودية', nameEn: 'Saudi Arabia', code: '00966', flag: '🇸🇦', iso: 'SA' },
  { nameAr: 'الإمارات', nameEn: 'UAE', code: '00971', flag: '🇦🇪', iso: 'AE' },
  { nameAr: 'الكويت', nameEn: 'Kuwait', code: '00965', flag: '🇰🇼', iso: 'KW' },
  { nameAr: 'قطر', nameEn: 'Qatar', code: '00974', flag: '🇶🇦', iso: 'QA' },
  { nameAr: 'البحرين', nameEn: 'Bahrain', code: '00973', flag: '🇧🇭', iso: 'BH' },
  { nameAr: 'عمان', nameEn: 'Oman', code: '00968', flag: '🇴🇲', iso: 'OM' },
  { nameAr: 'الأردن', nameEn: 'Jordan', code: '00962', flag: '🇯🇴', iso: 'JO' },
  { nameAr: 'مصر', nameEn: 'Egypt', code: '0020', flag: '🇪🇬', iso: 'EG' },
  { nameAr: 'لبنان', nameEn: 'Lebanon', code: '00961', flag: '🇱🇧', iso: 'LB' },
  { nameAr: 'العراق', nameEn: 'Iraq', code: '00964', flag: '🇮🇶', iso: 'IQ' },
  { nameAr: 'تركيا', nameEn: 'Turkey', code: '0090', flag: '🇹🇷', iso: 'TR' },
  { nameAr: 'أمريكا', nameEn: 'USA', code: '001', flag: '🇺🇸', iso: 'US' },
  { nameAr: 'بريطانيا', nameEn: 'UK', code: '0044', flag: '🇬🇧', iso: 'GB' },
];

const PhoneInput = ({ value = '', onChange, isRTL, hasError, label, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Try to extract country code and number from value
  // Default to SA if empty or not matching
  useEffect(() => {
    if (!value) {
      onChange('00966'); // Default initial
    }
  }, []);

  const currentCountry = countries.find(c => value.startsWith(c.code)) || countries[0];
  const numberPart = value.replace(currentCountry.code, '');
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    onChange(country.code + numberPart);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleNumberChange = (e) => {
    let newVal = e.target.value.replace(/[^0-9]/g, '');
    // Country code is already selected — local number must not start with 0
    newVal = newVal.replace(/^0+/, '').slice(0, 9);
    onChange(currentCountry.code + newVal);
  };

  const filteredCountries = countries.filter(c => 
    c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.nameAr.includes(searchTerm) ||
    c.code.includes(searchTerm)
  );

  return (
    <div className={styles.phoneInputContainer} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`${styles.wrapper} ${hasError ? styles.error : ''}`}>
        
        {/* Country Selector */}
        <div className={styles.countrySelector} ref={dropdownRef}>
          <button 
            type="button" 
            className={styles.selectorBtn} 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={styles.flag}>{currentCountry.flag}</span>
            <span className={styles.code}>{currentCountry.code}</span>
            <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
          </button>

          {isOpen && (
            <div className={styles.dropdown}>
              <div className={styles.searchBox}>
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder={isRTL ? "بحث..." : "Search..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className={styles.countryList}>
                {filteredCountries.map((c) => (
                  <button 
                    key={c.iso} 
                    type="button" 
                    className={`${styles.countryItem} ${c.code === currentCountry.code ? styles.active : ''}`}
                    onClick={() => handleCountrySelect(c)}
                  >
                    <span className={styles.itemFlag}>{c.flag}</span>
                    <span className={styles.itemName}>{isRTL ? c.nameAr : c.nameEn}</span>
                    <span className={styles.itemCode}>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Number Input */}
        <div className={styles.inputArea}>
          <input 
            type="tel" 
            id={id}
            className={styles.input} 
            value={numberPart}
            onChange={handleNumberChange}
            placeholder=" "
            maxLength={9}
          />
          <label htmlFor={id} className={styles.label}>
             {label}
          </label>
        </div>

      </div>
    </div>
  );
};

export default PhoneInput;
