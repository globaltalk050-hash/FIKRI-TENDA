import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Menu, X, Instagram, Twitter, Github, Phone, CheckCircle2, MapPin, MessageCircle, Image as ImageIcon, Loader2, Send, AlertCircle } from 'lucide-react';
import { db, auth, signInWithGoogle, logout } from './firebase';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// --- Firebase Error Handling ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We don't throw here to avoid crashing the whole app, but we log it
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// --- Error Boundary ---
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const { hasError } = (this as any).state;
    const { children } = (this as any).props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-16 h-16 text-brand-orange mb-6" />
          <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Waduh, Ada Masalah Teknis!</h1>
          <p className="text-white/60 max-w-md mb-8">Maaf Bos, sepertinya ada sedikit kendala. Silakan coba refresh halaman ya.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-orange text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-brand-orange transition-all"
          >
            Refresh Halaman
          </button>
        </div>
      );
    }

    return children;
  }
}

const WHATSAPP_NUMBER = "6281997135858";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Fikri%20Tenda,%20saya%20ingin%20bertanya%20tentang%20penyewaan%20tenda.`;
const LOCATION_ADDRESS = "G3MG+7HF, Sekarmulya, Kec. Gabuswetan, Kabupaten Indramayu, Jawa Barat 45263";
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(LOCATION_ADDRESS)}`;

const GALLERY_PHOTOS = [
  'https://lh3.googleusercontent.com/d/1-wZAMeWyw6sMsVqwHgbDjS4MDEQ-RlBq',
  'https://lh3.googleusercontent.com/d/1n2KaN3_D4BcTkfaXoKN60PNKWFPt5rve',
  'https://lh3.googleusercontent.com/d/10Un4ZTwfZcfcqcnhOzvzTiTk35i6SccG',
  'https://lh3.googleusercontent.com/d/1mfQVXXqrqf0612ZsVDaQA_-hhvhe6lnu',
  'https://lh3.googleusercontent.com/d/1Kp2Ww2vHy9BwF0HQRq1unHMqvGSZ6LdS',
  'https://lh3.googleusercontent.com/d/1uvFl5WHBq1wjFCtQqqGwllP4ame8hp-T',
  'https://lh3.googleusercontent.com/d/1SLP15mSQIvh0TQV2neHDy_MjbukuRH-y'
];

const AutoQuantumGallery = ({ photos, loading }: { photos: any[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
      </div>
    );
  }

  const displayPhotos = photos.length > 0 ? photos.map(p => p.imageUrl) : GALLERY_PHOTOS;

  return (
    <div className="overflow-hidden py-12">
      <style>{`
        @keyframes floating {
          0% { transform: translateY(0px) rotate(2deg) scale(0.95); filter: brightness(0.8); }
          50% { transform: translateY(-15px) rotate(-2deg) scale(1.02); filter: brightness(1.1); }
          100% { transform: translateY(8px) rotate(1deg) scale(0.98); filter: brightness(0.9); }
        }
      `}</style>
      <div className="infinite-scroll-track gap-10">
        {[...displayPhotos, ...displayPhotos].map((src, index) => (
          <div key={index} style={{
            flex: '0 0 220px', 
            height: '320px', 
            borderRadius: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            /* ANIMASI OTOMATIS */
            animation: `floating ${6 + (index % displayPhotos.length)}s infinite alternate ease-in-out`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img src={src} style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '20px'
            }} referrerPolicy="no-referrer" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'contact_requests'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contact_requests');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-zinc-100">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nama Lengkap</label>
        <input 
          required
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Masukkan nama Anda"
          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nomor WhatsApp</label>
        <input 
          required
          type="tel" 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="Contoh: 08123456789"
          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pesan / Kebutuhan Acara</label>
        <textarea 
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Ceritakan kebutuhan tenda Anda..."
          className="w-full px-6 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all outline-none resize-none"
        />
      </div>
      <button 
        disabled={status === 'loading'}
        type="submit"
        className="w-full flex items-center justify-center gap-4 bg-brand-orange text-white py-6 rounded-full font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
      >
        {status === 'loading' ? <Loader2 className="animate-spin" /> : <Send size={18} />}
        {status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
      
      <AnimatePresence>
        {status === 'success' && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-emerald-600 text-center font-bold text-sm">
            Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-rose-600 text-center font-bold text-sm">
            Gagal mengirim pesan. Silakan coba lagi nanti.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
};

const PRICING_PACKAGES = [
  {
    id: '01',
    title: 'Paket Pernikahan Mewah',
    price: 'Rp 15.000.000',
    description: 'Tenda dekorasi VIP dengan AC, panggung megah, dan pencahayaan premium.',
    image: 'https://lh3.googleusercontent.com/d/1-wZAMeWyw6sMsVqwHgbDjS4MDEQ-RlBq'
  },
  {
    id: '02',
    title: 'Paket Pernikahan Standar',
    price: 'Rp 5.000.000',
    description: 'Tenda dekorasi lengkap dengan kursi dan panggung.',
    image: 'https://lh3.googleusercontent.com/d/1n2KaN3_D4BcTkfaXoKN60PNKWFPt5rve'
  },
  {
    id: '03',
    title: 'Paket Acara Kantor',
    price: 'Rp 3.500.000',
    description: 'Tenda sarnafil modern untuk event korporat.',
    image: 'https://lh3.googleusercontent.com/d/10Un4ZTwfZcfcqcnhOzvzTiTk35i6SccG'
  },
  {
    id: '04',
    title: 'Paket Pesta Rumah',
    price: 'Rp 1.500.000',
    description: 'Tenda plafon standar untuk acara keluarga.',
    image: 'https://lh3.googleusercontent.com/d/1mfQVXXqrqf0612ZsVDaQA_-hhvhe6lnu'
  }
];

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState('01');
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [user, setUser] = useState<any>(null);
  const { scrollY } = useScroll();

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX - window.innerWidth / 2) / 25;
    const y = (e.clientY - window.innerHeight / 2) / 25;
    setMouseOffset({ x, y });
  };
  
  // Transform nav color based on scroll
  const navColor = useTransform(scrollY, [0, 500], ['#ffffff', '#0a0a0a']);
  const navBg = useTransform(scrollY, [0, 500], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)']);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Gallery from Firebase
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('title', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGalleryImages(images);
      setLoadingGallery(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
      setLoadingGallery(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Services from Firebase
  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('title', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(docs);
      setLoadingServices(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
      setLoadingServices(false);
    });
    return () => unsubscribe();
  }, []);

  const displayServices = services.length > 0 ? services : PRICING_PACKAGES;

  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 >= 5) {
      if (!user) {
        signInWithGoogle().catch(err => console.error("Login failed:", err));
      } else {
        logout().catch(err => console.error("Logout failed:", err));
      }
      setClickCount(0);
    }
  };

  // Reset click count after 2 seconds of inactivity
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-brand-orange selection:text-white">
      {/* Navigasi */}
      <motion.nav 
        style={{ color: navColor, backgroundColor: navBg }}
        className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center backdrop-blur-md transition-colors duration-300"
      >
        {/* Glow Effect behind Nav */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50" />
        
        <div 
          className="flex flex-col items-center relative z-10 cursor-pointer"
          onClick={handleLogoClick}
        >
          <motion.div 
            animate={{ 
              opacity: [0.4, 0.8, 0.4],
              filter: ['drop-shadow(0 0 2px #B8860B)', 'drop-shadow(0 0 8px #B8860B)', 'drop-shadow(0 0 2px #B8860B)']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-1 bg-[#B8860B] rounded-t-full blur-[1px] mb-1" 
          />
          <div className="text-3xl font-black tracking-widest uppercase bg-gradient-to-b from-[#B8860B] via-black to-black bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(184,134,11,0.2)]">
            FIKRI TENDA
          </div>
          {user && (
            <div className="absolute -bottom-4 text-[8px] font-black text-brand-orange tracking-widest opacity-50">
              ADMIN ACTIVE
            </div>
          )}
        </div>

        <div className="hidden md:flex gap-16 text-xs font-bold uppercase tracking-[0.3em]">
          {['Beranda', 'Layanan', 'Galeri', 'Lokasi', 'Kontak'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:opacity-50 transition-opacity">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a 
            href={WHATSAPP_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-brand-orange text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section 
        id="beranda" 
        className="relative h-screen w-full overflow-hidden bg-[#050505]"
        onMouseMove={handleMouseMove}
        style={{ perspective: '1000px' }}
      >
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0 origin-top bg-[#050505]"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 1. TEKS RAKSASA DI BELAKANG (WATERMARK) */}
            <h1 style={{
              position: 'absolute',
              fontSize: '25vw',
              fontWeight: '900',
              color: 'rgba(255, 255, 255, 0.03)', // Lebih gelap lagi untuk background hitam
              top: '5%',
              left: '-5%',
              margin: 0,
              zIndex: 0,
              whiteSpace: 'nowrap'
            }}>
              TENDA
            </h1>

            {/* Luxurious Glowing Golden Arch Lights (From Gallery) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              {/* Left Arch */}
              <svg viewBox="0 0 500 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 h-full w-auto drop-shadow-[0_0_50px_rgba(255,180,0,0.4)]">
                <defs>
                  <linearGradient id="neon-gold-hero" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#FFFACD" />
                    <stop offset="100%" stopColor="#DAA520" />
                  </linearGradient>
                  <filter id="gold-glow-hero">
                    <feGaussianBlur stdDeviation="15" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <motion.path 
                  d="M-50 800 Q150 400 50 0" 
                  stroke="url(#neon-gold-hero)" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  filter="url(#gold-glow-hero)"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.6, 0.8, 0.5],
                    strokeWidth: [8, 10, 8, 11, 8]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>

              {/* Right Arch */}
              <svg viewBox="0 0 500 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 h-full w-auto scale-x-[-1] drop-shadow-[0_0_50px_rgba(255,180,0,0.4)]">
                <motion.path 
                  d="M-50 800 Q150 400 50 0" 
                  stroke="url(#neon-gold-hero)" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  filter="url(#gold-glow-hero)"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.6, 0.8, 0.5],
                    strokeWidth: [8, 10, 8, 11, 8]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            {/* 2. HANGING LIGHTS (MATCHING GALLERY STYLE) */}
            <div className="absolute top-0 left-0 w-full flex justify-around px-8 md:px-24 z-20">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={`hero-hanging-${i}`}
                  initial={{ y: -150 }}
                  animate={{ y: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 40 }}
                  className="hanging-light"
                  style={{ height: 80 + (i % 3) * 40 + 'px' }}
                />
              ))}
            </div>

            {/* 3. KONTEN UTAMA DENGAN EFEK KACA */}
            <div className="absolute top-[15%] right-[5%] max-w-md hidden lg:block">
              <div style={{
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(10px)', // Nyawa sinematik
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '30px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h2 style={{ fontSize: '50px', fontWeight: '900', color: '#fff', lineHeight: 1, margin: 0 }}>
                  ACARA <br/> <span style={{ fontStyle: 'italic', color: '#FFD700' }}>SEMPURNA</span>
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '20px' }}>
                  Solusi penyewaan tenda berkualitas untuk pernikahan, acara perusahaan, dan pesta spesial Anda. Kami hadirkan kenyamanan di setiap momen berharga.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-24 pb-24 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-10">
              <div className="overflow-hidden space-y-4">
                {/* Hero AI Curved Light with Quantum Parallax */}
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ 
                    width: '300px', 
                    opacity: [0, 0.8, 0.5, 0.8],
                    filter: ['drop-shadow(0 0 5px #B8860B)', 'drop-shadow(0 0 15px #B8860B)', 'drop-shadow(0 0 8px #B8860B)', 'drop-shadow(0 0 15px #B8860B)'],
                    x: mouseOffset.x * -0.5,
                    y: mouseOffset.y * -0.5,
                  }}
                  transition={{ 
                    width: { duration: 1.5, delay: 0.3 },
                    opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    filter: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    x: { type: 'spring', stiffness: 100, damping: 30 },
                    y: { type: 'spring', stiffness: 100, damping: 30 }
                  }}
                  className="h-2 border-t-4 border-[#B8860B] rounded-[150px_150px_0_0]"
                />
                <motion.h1 
                  initial={{ y: '100%' }}
                  animate={{ 
                    x: mouseOffset.x,
                    y: mouseOffset.y,
                    rotateX: -mouseOffset.y * 0.5,
                    rotateY: mouseOffset.x * 0.5,
                    filter: `drop-shadow(${mouseOffset.x * 0.1}px ${mouseOffset.y * 0.1}px 15px rgba(184, 134, 11, 0.4))`
                  }}
                  transition={{ 
                    y: { duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
                    x: { type: 'spring', stiffness: 100, damping: 30 },
                    rotateX: { type: 'spring', stiffness: 100, damping: 30 },
                    rotateY: { type: 'spring', stiffness: 100, damping: 30 }
                  }}
                  className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase metallic-gold"
                >
                  FIKRI<br/>
                  <span className="italic">TENDA</span>
                </motion.h1>
              </div>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="max-w-xl text-xl md:text-2xl font-medium leading-relaxed text-white/90"
              >
                Solusi penyewaan tenda berkualitas untuk pernikahan, acara perusahaan, dan pesta spesial Anda di Indramayu. Kami hadirkan kenyamanan di setiap momen berharga.
              </motion.p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-12">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-8 bg-white text-brand-orange px-12 py-6 rounded-full font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  Hubungi Kami
                  <Phone className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                </a>
              </motion.div>
              <div className="flex gap-8">
                <Instagram className="w-6 h-6 hover:scale-125 transition-transform cursor-pointer" />
                <Twitter className="w-6 h-6 hover:scale-125 transition-transform cursor-pointer" />
                <Github className="w-6 h-6 hover:scale-125 transition-transform cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Showcase - Infinite Scroll with Wedding Light */}
      <section id="galeri" className="py-12 bg-zinc-950 overflow-hidden relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Hanging Wedding Lights */}
          <div className="absolute top-0 left-0 w-full flex justify-around px-12">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`hanging-${i}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className="hanging-light"
                style={{ height: 60 + Math.random() * 60 + 'px' }}
              />
            ))}
          </div>

          {/* Floating Diamond Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0 
              }}
              animate={{ 
                y: [null, Math.random() * -100 - 50],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "linear"
              }}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
              style={{
                background: i % 3 === 0 ? '#B088FF' : i % 3 === 1 ? '#80D0FF' : 'white'
              }}
            />
          ))}

          {/* Luxurious Glowing Golden Arch Lights */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            animate={{ 
              x: [-10, 10, -10, 5, -5, 0],
              y: [-5, 5, -10, 10, -5, 0],
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 left-0 z-20 w-full h-full pointer-events-none"
          >
            {/* Left Arch */}
            <svg viewBox="0 0 500 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 h-full w-auto drop-shadow-[0_0_80px_rgba(255,180,0,0.6)]">
              <defs>
                <linearGradient id="neon-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FFFACD" />
                  <stop offset="100%" stopColor="#DAA520" />
                </linearGradient>
                <filter id="gold-glow">
                  <feGaussianBlur stdDeviation="15" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Elegant Curved Arch Structure */}
              <motion.path 
                d="M-50 800 Q150 400 50 0" 
                stroke="url(#neon-gold)" 
                strokeWidth="12" 
                strokeLinecap="round"
                filter="url(#gold-glow)"
                animate={{ 
                  opacity: [0.7, 1, 0.8, 1, 0.7],
                  strokeWidth: [12, 14, 12, 15, 12]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <path d="M-50 800 Q150 400 50 0" stroke="white" strokeWidth="2" opacity="0.5" />
              
              {/* Volumetric Light Rays */}
              {[...Array(5)].map((_, i) => (
                <motion.path
                  key={`ray-l-${i}`}
                  d={`M${50 + i*20} ${100 + i*50} L${200 + i*40} ${300 + i*80}`}
                  stroke="rgba(255,215,0,0.1)"
                  strokeWidth="40"
                  filter="blur(30px)"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 4, delay: i*0.5, repeat: Infinity }}
                />
              ))}
            </svg>

            {/* Right Arch */}
            <svg viewBox="0 0 500 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 h-full w-auto scale-x-[-1] drop-shadow-[0_0_80px_rgba(255,180,0,0.6)]">
              <motion.path 
                d="M-50 800 Q150 400 50 0" 
                stroke="url(#neon-gold)" 
                strokeWidth="12" 
                strokeLinecap="round"
                filter="url(#gold-glow)"
                animate={{ 
                  opacity: [0.7, 1, 0.8, 1, 0.7],
                  strokeWidth: [12, 14, 12, 15, 12]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <path d="M-50 800 Q150 400 50 0" stroke="white" strokeWidth="2" opacity="0.5" />
              
              {/* Volumetric Light Rays */}
              {[...Array(5)].map((_, i) => (
                <motion.path
                  key={`ray-r-${i}`}
                  d={`M${50 + i*20} ${100 + i*50} L${200 + i*40} ${300 + i*80}`}
                  stroke="rgba(255,215,0,0.1)"
                  strokeWidth="40"
                  filter="blur(30px)"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 4, delay: i*0.5, repeat: Infinity }}
                />
              ))}
            </svg>
          </motion.div>

          {/* Large Wedding Lights Glows */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [-20, 20, -20]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="wedding-light absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              x: [20, -20, 20]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="wedding-light absolute -bottom-20 -right-20 w-[800px] h-[800px] rounded-full"
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full spotlight opacity-60" />
        </div>

        <div className="relative z-30 space-y-8">
          <div className="px-8 md:px-24 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <h3 className="text-brand-orange font-bold uppercase tracking-[0.4em] text-xs">Cinematic Showcase</h3>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter bg-gradient-to-b from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                Momen <span className="italic">Abadi</span>
              </h2>
            </div>
          </div>

          <div className="relative">
            <AutoQuantumGallery photos={galleryImages} loading={loadingGallery} />
          </div>

          {/* New Order Button Position - Below Photos */}
          <div className="flex justify-center pt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a 
                href={WHATSAPP_LINK}
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-brand-orange text-white px-16 py-8 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-brand-orange transition-all hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,100,0,0.4)]"
              >
                Pesan Sekarang
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="layanan" className="py-32 px-8 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter bg-gradient-to-b from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            >
              Daftar <span className="italic">Harga</span>
            </motion.h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">Pilih paket yang sesuai dengan kebutuhan acara Anda. Kami menyediakan berbagai pilihan tenda berkualitas.</p>
          </div>

          <div className="expanding-card-container">
            {displayServices.map((pkg) => (
              <div 
                key={pkg.id}
                className={`expanding-card ${activeCard === pkg.id ? 'active' : ''}`}
                onClick={() => setActiveCard(pkg.id)}
              >
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                  className="absolute inset-0 w-full h-full object-cover brightness-75"
                  referrerPolicy="no-referrer"
                />
                <div className="expanding-card-number">{pkg.id}</div>
                <div className="expanding-card-content">
                  <h3 className="text-4xl font-black uppercase leading-none mb-2">{pkg.title}</h3>
                  <p className="text-brand-orange text-2xl font-bold mb-4">{pkg.price}</p>
                  <p className="text-white/80 mb-6">{pkg.description}</p>
                  <div className="space-y-2 mb-8">
                    {['Kualitas Premium', 'Pemasangan Cepat', 'Bebas Biaya Kirim*'].map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60">
                        <CheckCircle2 size={14} className="text-brand-orange" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Single Order Button below the pricing cards */}
          <div className="flex justify-center pt-12">
            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-brand-orange text-white px-12 py-6 rounded-full font-black uppercase tracking-widest hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Pesan Sekarang <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section id="lokasi" className="py-32 px-8 md:px-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-10">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter bg-gradient-to-b from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            >
              Lokasi <span className="italic">& Kontak</span>
            </motion.h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-lg font-bold uppercase tracking-widest mb-2">Alamat</h4>
                  <p className="text-zinc-500 leading-relaxed">{LOCATION_ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                  <Phone className="text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-lg font-bold uppercase tracking-widest mb-2">Kontak</h4>
                  <p className="text-zinc-500 leading-relaxed">+62 819-9713-5858</p>
                </div>
              </div>
            </div>

            <div className="h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.847526743844!2d108.136209!3d-6.413625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjQnNDkuMSJTIDEwOMKwMDgnMTAuMyJF!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-2">
              <h3 className="text-brand-orange font-bold uppercase tracking-[0.4em] text-xs">Kirim Pesan</h3>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">
                Konsultasi <span className="italic">Gratis</span>
              </h2>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-brand-dark text-white py-20 px-8 md:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6 flex flex-col items-start">
            <div className="flex flex-col items-center">
              <motion.div 
                animate={{ 
                  opacity: [0.3, 0.7, 0.3],
                  filter: ['drop-shadow(0 0 3px #B8860B)', 'drop-shadow(0 0 10px #B8860B)', 'drop-shadow(0 0 3px #B8860B)']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-1.5 bg-[#B8860B] rounded-t-full blur-[1px] mb-2" 
              />
              <div className="text-4xl font-black tracking-widest uppercase bg-gradient-to-b from-[#B8860B] via-black to-black bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(184,134,11,0.2)]">
                FIKRI TENDA
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Penyedia jasa penyewaan tenda terbaik di Indramayu. Kami melayani berbagai kebutuhan acara Anda dengan profesionalisme tinggi.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">Navigasi</h4>
            <div className="flex flex-col gap-4 text-sm text-white/60">
              {['Beranda', 'Layanan', 'Galeri', 'Lokasi', 'Kontak'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">Kontak Kami</h4>
            <div className="space-y-4 text-sm text-white/60">
              <p>{LOCATION_ADDRESS}</p>
              <p>+62 819-9713-5858</p>
              <p>info@fikritenda.com</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[10px] uppercase tracking-widest text-white/20">© 2026 FIKRI TENDA. All Rights Reserved.</p>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10">Firebase Connected</span>
            </div>
          </div>
          <div className="flex gap-8 text-white/20">
            <Instagram size={16} className="hover:text-white transition-colors cursor-pointer" />
            <Twitter size={16} className="hover:text-white transition-colors cursor-pointer" />
            <Github size={16} className="hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>

      {/* Overlay Menu Fullscreen */}
      <motion.div 
        initial={false}
        animate={{ clipPath: isMenuOpen ? 'circle(150% at 100% 0%)' : 'circle(0% at 100% 0%)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-black z-[150] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-12">
          {['Beranda', 'Layanan', 'Galeri', 'Lokasi', 'Kontak'].map((item) => (
            <button 
              key={item}
              className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter bg-gradient-to-b from-[#FFD700] to-[#B8860B] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:italic transition-all hover:scale-110"
              onClick={() => setIsMenuOpen(false)}
            >
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </button>
          ))}
        </div>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-12 right-12 text-white hover:text-brand-orange transition-colors">
          <X size={48} />
        </button>
      </motion.div>
    </div>
  );
}
