'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Megaphone } from 'lucide-react';
import Image from 'next/image';
import styles from './NewsTicker.module.css';
import useCMSStore from '@/store/useCMSStore';

const SPEED = 80;

const NewsTicker = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const sections = useCMSStore((state) => state.sections);

    const [items, setItems] = useState([]);
    const [label, setLabel] = useState('');

    const maskRef = useRef(null);
    const scrollRef = useRef(null);
    const rafRef = useRef(null);
    const posRef = useRef(0);
    const lastTsRef = useRef(null);

    // ───── Fetch & Sort ─────
    useEffect(() => {
        const tickerSections = (sections || []).filter(
            (s) => s.section_key === 'news_ticker'
        );
        if (!tickerSections.length) return;

        const labelData = tickerSections.find(
            (i) => i.type === 'news_ticker_label'
        );

        setLabel(
            labelData
                ? (isAr ? labelData.title_ar : labelData.title_en) || t('news.label')
                : t('news.label')
        );

        const newsData = tickerSections
            .filter((i) => i.type === 'news_ticker' && i.is_active)
            .sort((a, b) => (b.id || 0) - (a.id || 0)); // highest ID (latest) first

        setItems(newsData.map((i) => (isAr ? i.title_ar : i.title_en)));
    }, [sections, isAr, t]);

    // ───── Animation ─────
    useEffect(() => {
        if (!items.length) return;

        const scrollEl = scrollRef.current;
        const maskEl = maskRef.current;
        if (!scrollEl || !maskEl) return;

        const halfWidth = scrollEl.scrollWidth / 2;
        const maskWidth = maskEl.offsetWidth;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        posRef.current = isAr ? -maskWidth : maskWidth;
        lastTsRef.current = null;

        const animate = (ts) => {
            if (!lastTsRef.current) lastTsRef.current = ts;
            const dt = (ts - lastTsRef.current) / 1000;
            lastTsRef.current = ts;

            if (isAr) {
                posRef.current += SPEED * dt;
                if (posRef.current >= halfWidth) {
                    posRef.current -= halfWidth;
                }
            } else {
                posRef.current -= SPEED * dt;
                if (posRef.current <= -halfWidth) {
                    posRef.current += halfWidth;
                }
            }

            scrollEl.style.transform = `translateX(${posRef.current}px)`;
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [items, isAr]);

    if (!items.length) return null;

    const displayItems = isAr ? [...items].reverse() : items;
    const tickerItems = [...displayItems, ...displayItems];

    return (
        <div className={styles.tickerSection}>
            <div className={styles.container}>
                <div className={styles.tickerWrapper}>
                    <div className={styles.labelWrapper}>
                        <div className={styles.label}>
                            <Megaphone size={18} />
                            <span>{label}</span>
                        </div>
                    </div>

                    <div className={styles.contentMask} ref={maskRef}>
                        <div
                            ref={scrollRef}
                            className={styles.tickerScroll}
                            style={{
                                willChange: 'transform',
                                direction: 'ltr'
                            }}
                        >
                            {tickerItems.map((item, index) => (
                                <div key={index} className={styles.tickerItem}>
                                    <p>{item}</p>
                                    <div className={styles.tickerLogo}>
                                        <Image
                                            src="/logo.png"
                                            alt="Logo"
                                            width={24}
                                            height={24}
                                            className={styles.tickerLogoImg}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;