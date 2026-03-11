import React from 'react';

const InputField = ({ label, name, type = 'text', register, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          {...register(name, { required })}
          className="p-3 border-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder={placeholder}
          rows="4"
        />
      ) : (
        <input
          type={type}
          {...register(name, { required })}
          className="p-3 border-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputField;