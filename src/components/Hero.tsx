import { motion } from "motion/react";
import { ArrowRight, Star, CalendarCheck, Phone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center pt-20 pb-20">
      {/* Luxurious Tent Background Image with Sway Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ 
            scale: [1.1, 1.15, 1.1],
            x: ["0%", "-2%", "0%"],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000&auto=format&fit=crop" 
            alt="Background Tenda Mewah" 
            className="w-full h-full object-cover"
          />
          {/* Golden Orange Overlay for Theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 via-stone-900/20 to-white/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent mix-blend-overlay"></div>
        </motion.div>
        
        {/* Floating Particles/Dust for Atmosphere */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0, x: Math.random() * 100 }}
                animate={{ 
                  y: [0, -100 - Math.random() * 50], 
                  opacity: [0, 0.6, 0],
                  x: (Math.random() - 0.5) * 50
                }}
                transition={{ 
                  duration: 8 + Math.random() * 5, 
                  repeat: Infinity, 
                  ease: "linear", 
                  delay: Math.random() * 5 
                }}
                className="absolute w-2 h-2 bg-amber-400 rounded-full blur-sm"
                style={{ 
                  top: `${50 + Math.random() * 50}%`, 
                  left: `${Math.random() * 100}%` 
                }}
              />
            ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex justify-center"
          >
            <div className="bg-white/90 backdrop-blur-md border border-amber-200/50 rounded-full px-8 py-3 shadow-xl shadow-amber-900/5 flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-amber-800 font-bold text-sm tracking-widest uppercase">Solusi Pesta & Pernikahan Terbaik</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-stone-900 mb-8 leading-[0.9]"
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-amber-500 to-orange-600 drop-shadow-sm pb-4">
              FIKRI TENDA
            </span>
            <span className="block text-3xl md:text-5xl font-light text-stone-700 tracking-normal">
              Elegan. Mewah. Terpercaya.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="text-xl md:text-2xl text-stone-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Menyewakan tenda dekorasi VIP, kursi, panggung, dan perlengkapan pesta dengan sentuhan <span className="text-amber-600 font-bold">Gold & White</span> yang memukau untuk momen spesial Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open("https://wa.me/6281997135858", "_blank")}
              className="w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 border border-orange-400/20"
            >
              <Phone className="w-6 h-6" />
              Hubungi Kami
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#fff7ed" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-12 py-6 bg-white text-orange-700 border-2 border-orange-100 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:border-orange-300 transition-colors shadow-lg shadow-stone-200/50"
            >
              <CalendarCheck className="w-6 h-6" />
              Lihat Katalog
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
        <svg className="relative block w-full h-[120px] md:h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-orange-50/30"></path>
        </svg>
      </div>
    </section>
  );
}
