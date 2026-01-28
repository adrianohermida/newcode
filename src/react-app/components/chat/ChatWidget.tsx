import { BlogManagementModule } from '@/components/BlogManagement/BlogManagementModule';

export const BlogManagementWrapperModule = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-extrabold">Gestão de Blog</h2>
      <BlogManagementModule />
    </div>
  );
};
