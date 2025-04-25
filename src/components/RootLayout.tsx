import React from 'react';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
      <div className="w-full min-h-screen bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
