import { motion } from "motion/react";
import { Tent, Armchair, Music, Sparkles, Clock, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: <Tent className="w-8 h-8 text-amber-600" />,
    title: "Tenda Dekorasi VIP",
    description: "Pilihan tenda eksklusif dengan dekorasi kain serut, balon, dan sentuhan warna emas yang mewah."
  },
  {
    icon: <Armchair className="w-8 h-8 text-amber-600" />,
    title: "Kursi & Alat Pesta",
    description: "Menyediakan kursi Futura, Tiffany, hingga sofa VIP dengan cover bersih dan wangi."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-amber-600" />,
    title: "Dekorasi Pelaminan",
    description: "Paket dekorasi pelaminan modern dan tradisional yang dapat disesuaikan dengan tema acara."
  },
  {
    icon: <Music className="w-8 h-8 text-amber-600" />,
    title: "Sound System & Panggung",
    description: "Paket sound system jernih dan panggung rigging kokoh untuk hiburan yang maksimal."
  },
  {
    icon: <Clock className="w-8 h-8 text-amber-600" />,
    title: "Pemasangan Tepat Waktu",
    description: "Tim profesional kami menjamin pemasangan selesai H-1 acara dengan rapi dan aman."
  },
  {
    icon: <BadgeCheck className="w-8 h-8 text-amber-600" />,
    title: "Harga Kompetitif",
    description: "Dapatkan paket pernikahan lengkap dengan harga terbaik dan transparan tanpa biaya tersembunyi."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15
    }
  }
};

export default function Features() {
  return (
    <section className="py-32 bg-orange-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            Layanan Premium
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 tracking-tight"
          >
            Wujudkan Pesta <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Impian Anda</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-xl text-stone-600 leading-relaxed"
          >
            FIKRI TENDA hadir untuk melengkapi kebahagiaan Anda dengan perlengkapan pesta berkualitas tinggi dan pelayanan prima.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                transition: { type: "spring", stiffness: 200, damping: 25 } 
              }}
              className="group bg-white p-8 md:p-10 rounded-[2rem] hover:shadow-[0_20px_50px_-12px_rgba(251,146,60,0.2)] transition-all duration-500 border border-orange-100/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-transparent rounded-bl-[100px] -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150"></div>
              
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white transition-all duration-500 border border-orange-100 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-orange-500/30 relative z-10">
                <div className="group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-amber-600 transition-colors duration-300 relative z-10">{feature.title}</h3>
              <p className="text-stone-600 leading-relaxed text-lg relative z-10 group-hover:text-stone-700 transition-colors duration-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
