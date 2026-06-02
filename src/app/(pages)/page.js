"use client";
import { useState, useEffect } from "react";
import Hero from "@/components/Hero/Hero";
import Services from "@/components/Services/Services";
import CompanyHistory from "@/components/CompanyHistory/CompanyHistory";
import Projects from "@/components/Projects/Projects";
import Awards from "@/components/Awards/Awards";
import Partners from "@/components/Partners/Partners";
import Videos from "@/components/Videos/Videos";
import useCMSStore from "@/store/useCMSStore";
import styles from "./page.module.css";

export default function Home() {
  const sections = useCMSStore((state) => state.sections);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const homeSections = (sections || []).filter(section => section.section_key === 'home');
    if (homeSections.length > 0) {
      setHomeData(homeSections);
    }
  }, [sections]);

  return (
    <div className={styles.container}>
      <Hero homeData={homeData} />
      <CompanyHistory homeData={homeData} />
      <Services homeData={homeData} />
      <Projects homeData={homeData} />
      <Awards homeData={homeData} />
      <Partners homeData={homeData} />
      <Videos homeData={homeData} />
    </div>
  );
}
