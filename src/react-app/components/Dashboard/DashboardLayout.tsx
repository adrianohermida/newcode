import React from 'react';

type Props = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  content: React.ReactNode;
};

export const DashboardLayout = ({ sidebar, header, content }: Props) => (
  <div className="min-h-screen bg-brand-dark text-white">
    {/* <Header /> Removido, pois header já é passado como prop */}
    <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex gap-8">
        {sidebar}
        <section className="flex-1 space-y-6">
          {header}
          {content}
        </section>
      </div>
    </main>
  </div>
);
