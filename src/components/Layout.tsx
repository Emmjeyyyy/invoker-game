import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-screen bg-background flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="w-full h-full max-w-[1600px] flex flex-col lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-4 xl:gap-8">
        {children}
      </div>
    </div>
  );
};
