import React from 'react';
import GovHeader from './GovHeader';
import GovFooter from './GovFooter';

type Props = {
  children: React.ReactNode;
};

const GovLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <GovHeader />
      <main className="flex-1 pt-28">
        {children}
      </main>
      <GovFooter />
    </div>
  );
};

export default GovLayout;


