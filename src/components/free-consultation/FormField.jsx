import { DESK_INPUT, DESK_LABEL, INPUT, LABEL, SELECT } from './tokens';

export default function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
  as = 'input',
  options = [],
  className = '',
  inputMode,
  maxLength,
  min,
  max,
  readOnly = false,
  compact = false,
}) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const labelClass = compact ? DESK_LABEL : LABEL;
  const fieldClass = compact ? DESK_INPUT : INPUT;

  return (
    <div className={className}>
      <label htmlFor={fieldId} className={labelClass}>
        {label}
        {required ? <span className="text-[#000]"> *</span> : null}
      </label>
      {as === 'select' ? (
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          required={required}
          className={fieldClass}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      ) : as === 'display' ? (
        <div
          id={fieldId}
          className={`${fieldClass} flex min-h-[34px] items-center bg-[#f5f5f5] text-[#000] tabular-nums`}
          aria-live="polite"
        >
          {value || <span className="text-[#888]">{placeholder || '—'}</span>}
        </div>
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          className={fieldClass}
          inputMode={inputMode}
          maxLength={maxLength}
          min={min}
          max={max}
        />
      )}
    </div>
  );
}
