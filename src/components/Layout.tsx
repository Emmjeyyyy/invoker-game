import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isMenu?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isMenu }) => {
  return (
    <div className={`h-dvh w-screen bg-background flex flex-col items-center justify-center overflow-hidden ${isMenu ? 'p-0' : 'p-2 sm:p-4'}`}>
      <div className={`w-full h-full flex flex-col lg:flex-row ${isMenu ? '' : 'max-w-[1600px] gap-4 xl:gap-8'}`}>
        {children}
      </div>
    </div>
  );
};
