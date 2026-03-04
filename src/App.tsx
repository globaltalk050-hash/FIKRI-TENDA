import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Hero from "./components/Hero";
import BrandMarquee from "./components/BrandMarquee";
import Features from "./components/Features";
import Catalog from "./components/Gallery"; // Renamed import to match usage
import Footer from "./components/Footer";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white selection:bg-orange-200 selection:text-orange-900 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
              FT
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">Jasa Sewa</span>
              <span className="text-xl font-extrabold text-stone-800 leading-none">FIKRI TENDA</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-semibold text-stone-600 hover:text-orange-600 transition-colors">Beranda</a>
            <a href="#katalog" className="text-sm font-semibold text-stone-600 hover:text-orange-600 transition-colors">Katalog</a>
            <a href="#katalog" className="text-sm font-semibold text-stone-600 hover:text-orange-600 transition-colors">Harga</a>
            <a href="#katalog" className="text-sm font-semibold text-stone-600 hover:text-orange-600 transition-colors">Galeri</a>
            <div className="flex items-center gap-4 ml-4">
              <button className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95">
                Pesan Sekarang
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-stone-600 hover:bg-orange-50 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-orange-100 overflow-hidden shadow-xl"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                <a href="#" className="text-stone-600 font-semibold py-2 px-4 hover:bg-orange-50 rounded-lg">Beranda</a>
                <a href="#katalog" className="text-stone-600 font-semibold py-2 px-4 hover:bg-orange-50 rounded-lg">Katalog</a>
                <a href="#katalog" className="text-stone-600 font-semibold py-2 px-4 hover:bg-orange-50 rounded-lg">Harga</a>
                <a href="#katalog" className="text-stone-600 font-semibold py-2 px-4 hover:bg-orange-50 rounded-lg">Galeri</a>
                <hr className="border-orange-100 my-2" />
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20">
                  Pesan Sekarang
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        <Hero />
        <BrandMarquee />
        <Features />
        <Catalog />
        
        {/* CTA Section */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
              className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-[2.5rem] p-10 md:p-20 text-center overflow-hidden relative shadow-2xl shadow-stone-900/20"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight"
                >
                  Siap Membuat Acara Anda <br/>
                  <span className="text-amber-400">Tak Terlupakan?</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-stone-300 text-lg md:text-xl mb-10 font-light"
                >
                  Konsultasikan kebutuhan pesta Anda bersama kami. Gratis survei lokasi dan konsultasi dekorasi.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-5"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open("https://wa.me/6281997135858", "_blank")}
                    className="w-full sm:w-auto px-10 py-4 bg-amber-500 text-stone-900 rounded-full font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    Hubungi WhatsApp
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-stone-600 text-white rounded-full font-bold hover:bg-stone-800 hover:border-stone-500 transition-colors"
                  >
                    Lihat Paket
                  </motion.button>
                </motion.div>
              </div>
              
              {/* Decorative circles - Animated */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" 
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" 
              />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
