import { motion } from "motion/react";
import { ShoppingCart, CheckCircle, Info } from "lucide-react";

const catalogItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=800&auto=format&fit=crop",
    title: "Kursi Futura Cover VIP",
    description: "Set kursi Futura dengan cover ketat dan pita emas. Bersih, wangi, dan busa empuk.",
    price: "Rp 200.000",
    unit: "/ 20 unit",
    available: true
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    title: "Set Pelaminan & Tenda Emas",
    description: "Paket lengkap tenda dekorasi serut warna emas putih dengan hiasan bunga gantung dan lighting.",
    price: "Rp 950.000",
    unit: "/ paket",
    available: true
  }
];

export default function Catalog() {
  return (
    <section className="py-32 bg-stone-50 relative" id="katalog">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            Pilihan Paket Hemat
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 tracking-tight"
          >
            Katalog & Harga Sewa
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-xl text-stone-600 leading-relaxed"
          >
            Daftar harga transparan untuk kebutuhan pesta Anda. Kualitas terbaik dengan harga yang bersahabat.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {catalogItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-stone-200/50 border border-stone-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col relative"
            >
              {index === 1 && (
                <div className="absolute top-6 right-6 z-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-orange-500/30 tracking-wide uppercase">
                  Best Seller
                </div>
              )}
              
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <motion.img 
                  src={item.image} 
                  alt={item.title} 
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: index * 2 // Stagger the animation so they don't all move in sync
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md border ${item.available ? 'bg-green-500/90 text-white border-green-400/50' : 'bg-red-500/90 text-white border-red-400/50'}`}>
                    {item.available ? <CheckCircle className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                    {item.available ? 'Tersedia' : 'Habis'}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow relative">
                <h3 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-stone-500 text-base leading-relaxed mb-8 flex-grow">{item.description}</p>
                
                <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="block text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Harga Mulai</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-amber-600 font-extrabold text-2xl tracking-tight">{item.price}</span>
                      <span className="text-stone-400 text-sm font-medium">{item.unit}</span>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-stone-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-amber-500 hover:to-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
