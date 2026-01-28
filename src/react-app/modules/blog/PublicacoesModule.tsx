import { PublicacoesModule as BaseModule } from '@/components/Publicacoes/PublicacoesModule';

export const PublicacoesWrapperModule = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-extrabold">Publicações</h2>
      <BaseModule />
    </div>
  );
};
