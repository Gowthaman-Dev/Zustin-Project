// client/src/components/ui/Input.jsx
import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
          {label} {required && <span className="text-pink-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            block w-full rounded-2xl border 
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-pink-500 focus:border-pink-500'}
            ${Icon ? 'pl-10' : 'pl-4'}
            pr-4 py-3 text-white placeholder-gray-400
            bg-white/5 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-offset-0
            transition-all duration-200
          `}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;