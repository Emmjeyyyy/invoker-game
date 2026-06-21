import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-dvh w-screen bg-background flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="w-full h-full max-w-[1600px] flex flex-col lg:flex-row gap-4 xl:gap-8">
        {children}
      </div>
    </div>
  );
};
