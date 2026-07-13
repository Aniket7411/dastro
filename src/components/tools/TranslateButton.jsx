import { useState } from 'react';
import { Languages } from 'lucide-react';
import API_BASE from '../../utils/api.js';
import toast from '../../utils/toast.js';

function TranslateButton({ texts, lang, setLang, translations, onTranslate }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (lang === 'hi') {
      setLang('en');
      return;
    }

    // If already translated, just toggle
    if (translations && translations.length === texts.length) {
      setLang('hi');
      return;
    }

    // Call API to translate
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tools/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts }),
      });
      const data = await res.json();
      
      if (res.ok && data.success && data.translations && data.translations.length === texts.length) {
        onTranslate(data.translations);
        setLang('hi');
        toast.success('Translated to Hindi successfully!');
      } else {
        throw new Error(data.message || 'Translation failed');
      }
    } catch (err) {
      console.error('Translation Error:', err);
      toast.error('Could not translate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 w-full">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-extrabold uppercase tracking-widest shadow-sm transition-all duration-300 ${
          lang === 'hi'
            ? 'border-[#c6843f] bg-[#ffefd6] text-[#65250c] hover:bg-[#f3e5d8]'
            : 'border-[#f3e5d8] bg-white text-[#9c5a1e] hover:border-[#c6843f] hover:shadow-md'
        }`}
      >
        {loading ? (
          <>
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#9c5a1e] border-r-transparent"></div>
            Translating...
          </>
        ) : (
          <>
            <Languages className="h-4 w-4" />
            {lang === 'hi' ? 'View in English' : 'View in Hindi'}
          </>
        )}
      </button>
    </div>
  );
}

export default TranslateButton;
