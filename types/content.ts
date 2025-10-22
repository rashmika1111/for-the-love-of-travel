export interface ContentPageProps {
  title: string;
  author: string;
  publishDate: string;
  readTime: string;
  heroImage: string;
  content: string;
  category?: string;
  tags?: string[];
}

export interface ShareButtonProps {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'copy';
  url?: string;
  title?: string;
}

export interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  publishDate: string;
  category?: string;
}

export interface GalleryImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}





