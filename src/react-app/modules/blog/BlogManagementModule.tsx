/**
 * ✍️ BLOG MANAGEMENT – ADMIN MODULE
 * Wrapper para uso no Dashboard
 *
 * Dependência:
 * - src/components/BlogManagement/BlogManagementModule
 */

import React from 'react';
import { BlogManagementModule as BlogCore } from '@/components/BlogManagement/BlogManagementModule';

export const BlogManagementModule = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">
          Gestão de Blog
        </h2>
        <span className="text-xs uppercase text-brand-primary">
          Conteúdo institucional
        </span>
      </div>

      <BlogCore />
    </div>
  );
};
