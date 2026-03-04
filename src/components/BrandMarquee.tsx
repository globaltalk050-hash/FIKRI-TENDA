import { motion } from "motion/react";

const images = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225468359-2996bc01c34c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop",
];

export default function BrandMarquee() {
  return (
    <section className="py-12 bg-white overflow-hidden border-b border-orange-100">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-stone-400 font-bold tracking-widest uppercase text-xs">
          Dokumentasi Event & Klien Kami
        </p>
      </div>
      
      <div className="flex relative">
        {/* Gradient Masks for smooth fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

        <motion.div
          className="flex gap-8 flex-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 30, 
            ease: "linear", 
            repeat: Infinity 
          }}
        >
          {/* Duplicate images to create seamless loop */}
          {[...images, ...images, ...images].map((src, index) => (
            <div 
              key={index} 
              className="relative w-64 h-40 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg border border-stone-100 group"
            >
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
              <img 
                src={src} 
                alt={`Gallery ${index}`} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
