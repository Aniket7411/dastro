import React from 'react';
import PhoneInputLib from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function PhoneInput({
  value = '',
  onChange,
  name,
  id,
  className = '',
  placeholder = 'Mobile number',
  required = false,
  disabled = false,
  ...props
}) {
  const handleChange = (val) => {
    // react-phone-input-2 passes the value without the '+'.
    // Ensure value begins with + so the validation logic knows it's international format
    const normalizedValue = val ? '+' + val : '';
    if (onChange) {
      onChange({
        target: {
          name,
          value: normalizedValue,
        },
      });
    }
  };

  return (
    <div className="relative w-full custom-phone-wrapper">
      <style>{`
        .custom-phone-wrapper .custom-phone-input .flag-dropdown {
          background-color: transparent !important;
          border: none !important;
          border-right: 1px solid rgba(200, 131, 42, 0.2) !important;
          border-radius: 0 !important;
        }
        .custom-phone-wrapper .custom-phone-input .selected-flag {
          background-color: transparent !important;
          width: 52px !important;
          padding: 0 0 0 12px !important;
        }
        .custom-phone-wrapper .custom-phone-input .selected-flag:hover, 
        .custom-phone-wrapper .custom-phone-input .selected-flag:focus {
          background-color: transparent !important;
        }
        .custom-phone-wrapper .custom-phone-input .country-list {
          border-radius: 12px;
          border: 1px solid rgba(139, 74, 30, 0.15);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          color: #3D1A08;
          text-align: left;
        }
        .custom-phone-wrapper .custom-phone-input .country-list .country.highlight {
          background-color: rgba(200, 131, 42, 0.1);
        }
        .custom-phone-wrapper .custom-phone-input .country-list .search {
          background-color: #FFFBF5;
          padding: 10px;
        }
        .custom-phone-wrapper .custom-phone-input .country-list .search-box {
          border: 1px solid rgba(200, 131, 42, 0.2);
          border-radius: 8px;
          padding: 6px 12px;
          width: 100%;
          font-family: inherit;
        }
        .custom-phone-wrapper .custom-phone-input .country-list .search-box:focus {
          outline: none;
          border-color: #8B4A1E;
        }
      `}</style>
      {React.createElement(PhoneInputLib.default || PhoneInputLib, {
        country: "in",
        value: value,
        onChange: handleChange,
        enableSearch: true,
        disableSearchIcon: true,
        searchPlaceholder: "Search country...",
        inputProps: {
          name,
          id,
          required,
          disabled,
          ...props,
        },
        placeholder: placeholder,
        containerClass: "w-full relative custom-phone-input",
        inputClass: `!w-full ${className} !pl-[64px]`,
        buttonClass: "!bg-transparent !border-0",
        dropdownClass: "!w-[300px] !text-sm"
      })}
    </div>
  );
}
