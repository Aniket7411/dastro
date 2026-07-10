import { useState, useRef, useEffect } from 'react';

// Debounce hook to avoid flooding the API
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function PlaceAutocomplete({ value, onChange, onSelect, placeholder = "Type city name..." }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const wrapperRef = useRef(null);
  const skipNextFetchRef = useRef(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    if (debouncedQuery.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const fetchSuggestions = async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedQuery)}&format=json&limit=6&featuretype=city,town,village`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelect = (place) => {
    const label = place.display_name.split(',').slice(0, 3).join(', ');
    skipNextFetchRef.current = true;
    setQuery(label);
    setSuggestions([]);
    setShowDropdown(false);
    onSelect({ lat: place.lat, lon: place.lon, displayName: place.display_name, label });
  };

  const clear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    onChange('');
  };

  return (
    <div className="place-autocomplete-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#c6843f',
            pointerEvents: 'none',
            display: 'flex',
          }}
        >
          {searching ? (
            <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }}></span>
          ) : (
            <i className="fas fa-map-marker-alt"></i>
          )}
        </span>
        <input
          type="text"
          className="form-control"
          style={{ color: '#65250c', paddingLeft: '2.5rem', paddingRight: query ? '2.25rem' : undefined }}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          autoComplete="off"
          required
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear birth place"
            className="text-[#c6843f] transition hover:text-[#9c5a1e]"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-times-circle"></i>
          </button>
        )}
      </div>

      {showDropdown && (
        <ul
          className="absolute z-50 mt-1.5 max-h-52 w-full overflow-y-auto rounded-xl border border-[#f3e5d8] bg-white py-1 shadow-[0_12px_28px_rgba(139,74,30,0.14)]"
        >
          {suggestions.map((place, i) => {
            const parts = place.display_name.split(',');
            const primary = parts.slice(0, 2).join(',').trim();
            const secondary = parts.slice(2, 4).join(',').trim();
            return (
              <li
                key={i}
                onClick={() => handleSelect(place)}
                className="flex cursor-pointer items-start gap-2 px-3 py-2 text-sm transition hover:bg-[#fff3e0]"
              >
                <i className="fas fa-map-marker-alt mt-0.5 text-[#c6843f]"></i>
                <span className="leading-snug">
                  <span className="font-semibold text-[#65250c]">{primary}</span>
                  {secondary && <span className="text-[#9c847b]">, {secondary}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PlaceAutocomplete;
