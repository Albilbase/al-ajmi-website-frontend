
import Hero from "@/components/Hero/Hero";
import Services from "@/components/Services/Services";
import CompanyHistory from "@/components/CompanyHistory/CompanyHistory";
import Projects from "@/components/Projects/Projects";
import Awards from "@/components/Awards/Awards";
import Partners from "@/components/Partners/Partners";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Hero />
      <CompanyHistory />
      <Services />
      <Projects />
      <Awards />
      <Partners />
      {/* Other sections can go here */}
    </div>
  );
}
