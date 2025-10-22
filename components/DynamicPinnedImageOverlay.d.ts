import { ReactNode } from 'react';

export interface ArticleSection {
  type: 'article';
  title?: string;
  content?: string;
  changingImages?: Array<{ 
    url: string; 
    altText?: string; 
    caption?: string; 
    order?: number 
  }>;
  pinnedImage?: { 
    url: string; 
    altText?: string; 
    caption?: string 
  };
  layout?: { 
    imageSize?: 'small'|'medium'|'large'; 
    showPinnedImage?: boolean; 
    showChangingImages?: boolean 
  };
  animation?: { 
    enabled?: boolean; 
    type?: 'fadeIn'|'slideUp'|'none'; 
    duration?: number; 
    delay?: number 
  };
}

export interface DynamicPinnedImageOverlayProps {
  articleSection: ArticleSection;
  viewportVh?: number;
  scrim?: boolean;
  lead?: ReactNode;
}

declare const DynamicPinnedImageOverlay: React.FC<DynamicPinnedImageOverlayProps>;
export default DynamicPinnedImageOverlay;





