import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  headerBg?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  icon, 
  headerBg = 'bg-white', 
  footer 
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-100 shadow-md shadow-gray-100 overflow-hidden ${className}`}>
      {title && (
        <div className={`${headerBg} p-4 border-b border-gray-100 flex items-center`}>
          {icon && <div className="mr-3">{icon}</div>}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
      {footer && (
        <div className="border-t border-gray-100 bg-white px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 