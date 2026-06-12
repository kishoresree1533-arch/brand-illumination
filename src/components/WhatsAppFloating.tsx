import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ExternalLink } from "lucide-react";

export function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* ── Popup Card ── */}
      {isOpen && (
        <div className="mb-4 w-72 rounded-2xl bg-[#0d1b2a] border border-[#c9a84c]/20 p-5 shadow-2xl animate-fadein relative overflow-hidden">
          {/* Subtle glow border effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a84c] to-[#e8c56d]" />
          
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#c9a84c] font-black">WhatsApp Studio</h4>
              <p className="text-[10px] text-white/50 mt-0.5">We typically reply instantly</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-[12px] text-white/70 leading-relaxed mb-4">
            Select a representative to start your signage consultation on WhatsApp:
          </p>

          <div className="flex flex-col gap-2.5">
            {/* Representative 1 */}
            <a 
              href="https://wa.me/918807247435"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 hover:border-[#c9a84c]/40 hover:bg-white/10 p-3 transition-all group"
            >
              <div>
                <div className="text-[11px] font-bold text-[#c9a84c] uppercase tracking-wider">Representative 1</div>
                <div className="text-xs text-white/90 font-medium mt-0.5">+91 88072 47435</div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-white/30 group-hover:text-white transition-colors" />
            </a>

            {/* Representative 2 */}
            <a 
              href="https://wa.me/916374863533"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 hover:border-[#c9a84c]/40 hover:bg-white/10 p-3 transition-all group"
            >
              <div>
                <div className="text-[11px] font-bold text-[#c9a84c] uppercase tracking-wider">Representative 2</div>
                <div className="text-xs text-white/90 font-medium mt-0.5">+91 63748 63533</div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-white/30 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      )}

      {/* ── Trigger Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        style={{
          boxShadow: "0 8px 24px rgba(37, 211, 102, 0.35), 0 0 0 1px rgba(37, 211, 102, 0.15)",
          zIndex: 10000
        }}
        aria-label="WhatsApp options"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <svg 
            viewBox="0 0 24 24" 
            className="h-7 w-7 text-white fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>
    </div>
  );
}
