import { motion } from "motion/react";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-16 border-t border-stone-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                FT
              </div>
              <h3 className="text-white text-xl font-bold tracking-tight">FIKRI TENDA</h3>
            </div>
            <p className="text-stone-400 leading-relaxed mb-6">
              Mitra terpercaya untuk segala kebutuhan pesta Anda. Kami menghadirkan kemewahan dan kenyamanan dalam setiap acara.
            </p>
            <div className="text-sm text-stone-500">
              <p>Jl. Pesta Meriah No. 88</p>
              <p>Jakarta Selatan, Indonesia</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Layanan</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">Sewa Tenda Dekorasi</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">Paket Pernikahan</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">Sewa Kursi & Meja</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2">Sound System</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Informasi</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200">Galeri Foto</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200">Testimoni Klien</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200">Syarat & Ketentuan</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li><a href="https://wa.me/6281997135858" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp: +62 819-9713-5858</a></li>
              <li><a href="mailto:info@fikritenda.com" className="hover:text-amber-400 transition-colors duration-200">Email: info@fikritenda.com</a></li>
              <li><span className="hover:text-amber-400 transition-colors duration-200">Jam Operasional: 08.00 - 20.00</span></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>&copy; 2026 FIKRI TENDA. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
