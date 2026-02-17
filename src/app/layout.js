
import { Outfit, Almarai, Inter } from "next/font/google";
import "./globals.css";
import TranslationProvider from "@/components/TranslationProvider";
import CMSInitializer from "@/components/CMSInitializer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "Alajmi Company | Dashboard",
  description: "Alajmi Company Administration Dashboard",
  icons: {
    icon: "/logo.png",
  },
};

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${outfit.variable} ${almarai.variable} ${inter.variable}`}>
        <TranslationProvider>
          <CMSInitializer>
            {children}
          </CMSInitializer>
        </TranslationProvider>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
