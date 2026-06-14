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
    setQuery(label);
    setSuggestions([]);
    setShowDropdown(false);
    onSelect({ lat: place.lat, lon: place.lon, displayName: place.display_name, label });
  };

  return (
    <div className="place-autocomplete-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>
      <div className="input-group">
        <span className="input-group-text bg-transparent border-secondary text-muted">
          {searching ? (
            <span className="spinner-border spinner-border-sm text-pink" style={{ width: '14px', height: '14px' }}></span>
          ) : (
            <i className="fas fa-map-marker-alt text-pink"></i>
          )}
        </span>
        <input
          type="text"
          className="form-control bg-transparent text-white border-secondary"
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
      </div>

      {showDropdown && (
        <ul className="place-suggestions-dropdown">
          {suggestions.map((place, i) => {
            const parts = place.display_name.split(',');
            const primary = parts.slice(0, 2).join(',').trim();
            const secondary = parts.slice(2, 4).join(',').trim();
            return (
              <li key={i} onClick={() => handleSelect(place)} className="suggestion-item">
                <i className="fas fa-map-pin me-2 text-pink opacity-75"></i>
                <span className="suggestion-primary">{primary}</span>
                {secondary && <span className="suggestion-secondary">, {secondary}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PlaceAutocomplete;
