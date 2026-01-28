import { AISessionViewer } from '@/components/AISessionViewer';

export const AIMonitoringModule = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-extrabold">IA Monitorada</h2>
      <AISessionViewer />
    </div>
  );
};