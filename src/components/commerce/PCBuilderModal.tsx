import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/i18n';

const PC_BUILDER_URL = 'https://pcbuilder101.vercel.app';

interface PCBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getStoreName(): string {
  try {
    const raw = localStorage.getItem('jStorage');
    if (raw) {
      const js = JSON.parse(raw);
      const keys = Object.keys(js).filter(k => k.startsWith('cart_') && k !== 'cart_www');
      if (keys.length > 0) return keys[0].replace('cart_', '');
    }
  } catch {}
  const h = window.location.hostname;
  if (h.includes('aluf.co.il')) return 'alufshop';
  if (h.includes('.konimbo.co.il')) return h.split('.')[0];
  return 'alufshop';
}

function getCookieDomain(): string {
  const h = window.location.hostname;
  if (h.includes('aluf.co.il')) return '.aluf.co.il';
  if (h.includes('.konimbo.co.il')) return '.konimbo.co.il';
  return h;
}

export function PCBuilderModal({ isOpen, onClose }: PCBuilderModalProps) {
  const { dir, lang, t } = useLang();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeCreated, setIframeCreated] = useState(false);

  // Lazy-create iframe on first open
  useEffect(() => {
    if (isOpen && !iframeCreated) setIframeCreated(true);
  }, [isOpen, iframeCreated]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Message handler from iframe
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data;
      if (!data || typeof data.type !== 'string') return;
      if (data.type === 'ADD_TO_CART' && data.payload?.products) {
        handleAddToCart(data.payload.products, data.payload.totalPrice ?? 0);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sendToIframe(type: string, payload: object) {
    iframeRef.current?.contentWindow?.postMessage({ type, payload }, '*');
  }

  function handleAddToCart(products: any[], totalPrice: number) {
    const raw = localStorage.getItem('jStorage');
    let js: any;
    try { js = raw ? JSON.parse(raw) : { __jstorage_meta: { CRC32: {}, TTL: {} } }; }
    catch { js = { __jstorage_meta: { CRC32: {}, TTL: {} } }; }

    // Reset cart products
    localStorage.setItem('order_items', '[]');
    js[`cart_${getStoreName()}`] = '';
    document.cookie = `num_of_cart_items=0; path=/; domain=${getCookieDomain()}`;

    let ok = 0, fail = 0, idx = 0;

    function addNext() {
      if (idx >= products.length) { finish(ok, fail, totalPrice, js); return; }
      const p = products[idx++];
      try {
        let items: any[] = [];
        try { items = JSON.parse(localStorage.getItem('order_items') || '[]'); } catch {}
        if (!Array.isArray(items)) items = [];
        const i = items.findIndex(x => String(x.item_id) === String(p.id));
        if (i > -1) {
          items[i].quantity = (items[i].quantity || 1) + (p.quantity || 1);
        } else {
          items.push({ item_id: String(p.id), item_name: p.title || '', price: p.price || 0, quantity: p.quantity || 1, item_category: p.category || '', item_brand: p.brand || '', item_image: p.image || '' });
        }
        localStorage.setItem('order_items', JSON.stringify(items));
        const total = items.reduce((s: number, x: any) => s + (x.quantity || 1), 0);
        document.cookie = `num_of_cart_items=${total}; path=/; domain=${getCookieDomain()}`;
        ok++;
      } catch { fail++; }
      addNext();
    }
    addNext();

    function finish(successCount: number, failCount: number, price: number, sharedJs: any) {
      const cartKey = `cart_${getStoreName()}`;
      if (!sharedJs.__jstorage_meta) sharedJs.__jstorage_meta = { CRC32: {}, TTL: {} };
      if (!sharedJs.__jstorage_meta.CRC32) sharedJs.__jstorage_meta.CRC32 = {};
      sharedJs.__jstorage_meta.CRC32[cartKey] = '2.' + Math.floor(Math.random() * 1e10);
      localStorage.setItem('jStorage', JSON.stringify(sharedJs));
      localStorage.setItem('jStorage_update', String(+new Date()));
      sendToIframe('CART_UPDATED', { success: failCount === 0, cartTotal: price });
      if (failCount === 0) {
        setTimeout(() => { onClose(); window.location.reload(); }, 1500);
      }
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[2147483647] transition-opacity duration-300 flex ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`w-full h-full flex flex-col transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ background: '#f8f9fa' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #030213 0%, #1a1927 100%)', direction: dir }}
        >
          <div>
            <h2 className="text-2xl font-bold m-0" style={{ color: '#ff8c42' }}>{t('pcbuilder.modal.title')}</h2>
            <p className="text-sm text-white/80 mt-1 m-0 hidden md:block">{t('pcbuilder.modal.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white text-2xl leading-none transition-all duration-300 hover:rotate-90"
            style={{ border: '2px solid rgba(255,255,255,0.3)', background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff8c42'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto relative">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin" />
              <span>{t('pcbuilder.modal.loading')}</span>
            </div>
          )}
          {iframeCreated && (
            <iframe
              ref={iframeRef}
              src={`${PC_BUILDER_URL}?lang=${lang}`}
              className="w-full h-full border-0 block"
              style={{ minWidth: '100%' }}
              onLoad={() => setIframeLoaded(true)}
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
