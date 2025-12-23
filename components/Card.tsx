import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
          {icon && <div className="text-brand-600">{icon}</div>}
          {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
        </div>
      )}
      <div className="text-slate-600">
        {children}
      </div>
    </div>
  );
};
