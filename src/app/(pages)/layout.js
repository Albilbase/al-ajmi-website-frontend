
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function PagesLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="public-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
