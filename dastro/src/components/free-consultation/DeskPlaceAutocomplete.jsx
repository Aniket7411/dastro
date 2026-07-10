import { useEffect, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { DESK_INPUT, DESK_LABEL } from './tokens';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** Place-of-birth input with Nominatim (OpenStreetMap) city autocomplete, styled for the counsellor desk. */
export default function DeskPlaceAutocomplete({ label, value, onChange, onSelectCoords, required, className = '' }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const wrapperRef = useRef(null);
  const skipNextFetchRef = useRef(false);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    if (debouncedQuery.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    let cancelled = false;
    const fetchSuggestions = async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedQuery)}&format=json&limit=6&featuretype=city,town,village`,
          { headers: { 'Accept-Language': 'en' } },
        );
        const data = await res.json();
        if (!cancelled) {
          setSuggestions(data);
          setShowDropdown(data.length > 0);
        }
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    };
    fetchSuggestions();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const handleSelect = (place) => {
    const label2 = place.display_name.split(',').slice(0, 3).join(', ');
    skipNextFetchRef.current = true;
    setQuery(label2);
    setSuggestions([]);
    setShowDropdown(false);
    onChange(label2);
    onSelectCoords({ lat: parseFloat(place.lat), lon: parseFloat(place.lon) });
  };

  const clear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    onChange('');
    onSelectCoords(null);
  };

  return (
    <div className={className} ref={wrapperRef} style={{ position: 'relative' }}>
      <label className={DESK_LABEL}>
        {label}
        {required ? <span className="text-[#000]"> *</span> : null}
      </label>
      <div style={{ position: 'relative' }}>
        <MapPin
          size={13}
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#888]"
          aria-hidden
        />
        <input
          type="text"
          className={`${DESK_INPUT} !pl-6 ${query ? '!pr-6' : ''}`}
          placeholder="City, e.g. Lucknow"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            onChange(val);
            onSelectCoords(null);
          }}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          autoComplete="off"
          required={required}
        />
        {query ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear place of birth"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#000]"
          >
            <X size={13} />
          </button>
        ) : null}
      </div>

      {showDropdown ? (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-[#000] bg-[#fff] py-1 shadow-md">
          {suggestions.map((place, i) => {
            const parts = place.display_name.split(',');
            const primary = parts.slice(0, 2).join(',').trim();
            const secondary = parts.slice(2, 4).join(',').trim();
            return (
              <li
                key={i}
                onClick={() => handleSelect(place)}
                className="flex cursor-pointer items-start gap-1.5 px-2.5 py-1.5 font-body text-xs transition hover:bg-[#f5f5f5]"
              >
                <MapPin size={12} className="mt-0.5 shrink-0 text-[#888]" aria-hidden />
                <span className="leading-snug">
                  <span className="font-semibold text-[#000]">{primary}</span>
                  {secondary ? <span className="text-[#888]">, {secondary}</span> : null}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
      {searching ? <p className="mt-0.5 font-body text-[10px] text-[#888]">Searching…</p> : null}
    </div>
  );
}
