import { useEffect } from 'react';

interface ResourcePreloaderProps {
  resources: string[];
}

const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({ resources }) => {
  useEffect(() => {
    // 预加载关键资源
    resources.forEach(resource => {
      if (resource.endsWith('.js')) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'script';
        document.head.appendChild(link);
      } else if (resource.endsWith('.css')) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
      } else if (resource.endsWith('.svg') || resource.endsWith('.png') || resource.endsWith('.jpg')) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'image';
        document.head.appendChild(link);
      }
    });
  }, [resources]);

  return null;
};

export default ResourcePreloader;
