import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-background flex items-center justify-center p-4">
      <div className="w-full h-full max-w-[1400px] max-h-[850px] grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[300px_1fr_300px] gap-4 xl:gap-8">
        {children}
      </div>
    </div>
  );
};
