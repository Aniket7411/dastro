import { LABEL, INPUT, SELECT } from './tokens';

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
  readOnly = false,
}) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={className}>
      <label htmlFor={fieldId} className={LABEL}>
        {label}
        {required ? <span className="text-site-accent"> *</span> : null}
      </label>
      {as === 'select' ? (
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          required={required}
          className={SELECT}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          className={INPUT}
          inputMode={inputMode}
          maxLength={maxLength}
        />
      )}
    </div>
  );
}
