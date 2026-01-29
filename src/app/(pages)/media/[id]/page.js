"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import styles from './mediaDetail.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const MediaDetailPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const params = useParams();
  const mediaId = parseInt(params.id);

  const mediaImages = t('mediaPage.items', { returnObjects: true }) || [];
  const currentMedia = mediaImages[mediaId];

  if (!currentMedia) {
    return (
      <div className={styles.notFound}>
        <h1>{isRTL ? 'العنصر غير موجود' : 'Item Not Found'}</h1>
        <Link href="/media" className={styles.backLink}>
          {isRTL ? 'العودة إلى الميديا' : 'Back to Media'}
        </Link>
      </div>
    );
  }

  // Duplicate the image 3 times for slider
  const sliderImages = [
    currentMedia.src,
    currentMedia.src,
    currentMedia.src
  ];

  return (
    <div className={styles.mediaDetailSection} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Banner */}
      <div 
        className={styles.hero}
        style={{ backgroundImage: "url('/images/mediacenterbanner.jpg')" }}
      >
        <div className={styles.heroOverlay} />
        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className={styles.title}>{currentMedia.title}</h1>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Left Side - Text Content */}
          <motion.div 
            className={styles.textContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.breadcrumb}>
              <Link href="/media" className={styles.breadcrumbLink}>
                {isRTL ? 'الميديا' : 'Media'}
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>{currentMedia.title}</span>
            </div>

            <h2 className={styles.contentTitle}>{currentMedia.title}</h2>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <Calendar size={20} />
                <span>{isRTL ? '٦ يناير ٢٠٢٦' : 'January 6, 2026'}</span>
              </div>
              <div className={styles.metaItem}>
                <Tag size={20} />
                <span>{isRTL ? 'أخبار الشركة' : 'Company News'}</span>
              </div>
            </div>

            <div className={styles.description}>
              <p>
                {isRTL 
                  ? 'تفخر شركة عبد العالي العجمي بتقديم هذا الإنجاز الجديد الذي يعكس التزامنا المستمر بالتميز والجودة في جميع مشاريعنا. نسعى دائماً لتحقيق أعلى معايير الأداء والابتكار في قطاع البناء والتشييد.'
                  : 'Abdul Ali Al-Ajmi Company is proud to present this new achievement that reflects our continuous commitment to excellence and quality in all our projects. We always strive to achieve the highest standards of performance and innovation in the construction sector.'
                }
              </p>
              <p>
                {isRTL
                  ? 'يأتي هذا المشروع ضمن خطتنا الاستراتيجية للمساهمة في تحقيق رؤية المملكة 2030، حيث نعمل على تطوير البنية التحتية وتقديم حلول مبتكرة تواكب التطور المستمر في المملكة العربية السعودية.'
                  : 'This project comes as part of our strategic plan to contribute to achieving Saudi Vision 2030, as we work on developing infrastructure and providing innovative solutions that keep pace with the continuous development in the Kingdom of Saudi Arabia.'
                }
              </p>
              <p>
                {isRTL
                  ? 'نشكر جميع الشركاء والعملاء على ثقتهم المستمرة، ونتطلع إلى مزيد من التعاون والنجاح المشترك في المستقبل. إن هذا الإنجاز هو نتيجة للعمل الجاد والتفاني من فريقنا المتميز الذي يعمل بلا كلل لتحقيق أهدافنا الطموحة.'
                  : 'We thank all partners and clients for their continued trust, and we look forward to more cooperation and mutual success in the future. This achievement is the result of hard work and dedication from our distinguished team that works tirelessly to achieve our ambitious goals.'
                }
              </p>
              <p>
                {isRTL
                  ? 'تلتزم شركة العجمي بتقديم أفضل الخدمات والحلول المبتكرة التي تلبي احتياجات عملائنا وتساهم في تطوير المملكة. نحن نؤمن بأن النجاح الحقيقي يكمن في رضا عملائنا وتحقيق تطلعاتهم.'
                  : 'Al-Ajmi Company is committed to providing the best services and innovative solutions that meet our clients\' needs and contribute to the development of the Kingdom. We believe that true success lies in our clients\' satisfaction and achieving their aspirations.'
                }
              </p>
            </div>

            <Link href="/media" className={styles.backButton}>
              {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
              <span>{isRTL ? 'العودة إلى الميديا' : 'Back to Media'}</span>
            </Link>
          </motion.div>

          {/* Right Side - Image Slider */}
          <motion.div 
            className={styles.sliderContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.sliderWrapper}>
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                navigation={{
                  nextEl: `.${styles.swiperNext}`,
                  prevEl: `.${styles.swiperPrev}`,
                }}
                pagination={{
                  clickable: true,
                  el: `.${styles.swiperPagination}`,
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className={styles.swiper}
                dir={isRTL ? 'rtl' : 'ltr'}
                key={isRTL ? 'rtl' : 'ltr'}
              >
                {sliderImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.slideImageWrapper}>
                      <Image
                        src={`/images/media/${img}`}
                        alt={`${currentMedia.title} - ${index + 1}`}
                        fill
                        className={styles.slideImage}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        quality={90}
                        unoptimized
                        priority={index === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation */}
              <button className={`${styles.swiperButton} ${styles.swiperPrev}`}>
                {isRTL ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
              </button>
              <button className={`${styles.swiperButton} ${styles.swiperNext}`}>
                {isRTL ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
              </button>

              {/* Custom Pagination */}
              <div className={styles.swiperPagination}></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailPage;
