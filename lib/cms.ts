// frontend/lib/cms.ts
export type ContentSection =
  | { type: 'hero'; backgroundImage?: string; backgroundVideo?: string; title?: string; subtitle?: string; author?: string; publishDate?: string; readTime?: string; overlayOpacity?: number; height?: { mobile:string; tablet:string; desktop:string }; titleSize?: { mobile:string; tablet:string; desktop:string }; parallaxEnabled?: boolean; parallaxSpeed?: number; backgroundPosition?: 'center'|'top'|'bottom'|'left'|'right'; backgroundSize?: 'cover'|'contain' }
  | { type: 'text'; content?: string; hasDropCap?: boolean; alignment?: 'left'|'center'|'right'|'justify' }
  | { type: 'article'; title?: string; content?: string; changingImages?: Array<{ url: string; altText?: string; caption?: string; order?: number }>; pinnedImage?: { url: string; altText?: string; caption?: string }; layout?: { imageSize?: 'small'|'medium'|'large'; showPinnedImage?: boolean; showChangingImages?: boolean }; animation?: { enabled?: boolean; type?: 'fadeIn'|'slideUp'|'none'; duration?: number; delay?: number } }
  | { type: 'image'; imageUrl?: string; altText?: string; caption?: string; alignment?: 'left'|'center'|'right'; rounded?: boolean; shadow?: boolean; width?: number; height?: number }
  | { type: 'video'; videoUrl?: string; title?: string; description?: string; caption?: string; width?: number; alignment?: 'left'|'center'|'right'; autoplay?: boolean; muted?: boolean; loop?: boolean; controls?: boolean; poster?: string; height?: { mobile: string; tablet: string; desktop: string }; rounded?: boolean; shadow?: boolean; animation?: { enabled?: boolean; type?: 'fadeIn'|'slideUp'|'scaleIn'|'none'; duration?: number; delay?: number } }
  | { type: 'gallery'; images: Array<{ url: string; altText?: string; caption?: string; width?: number; height?: number }>; layout?: 'grid'|'masonry'|'carousel'|'postcard'|'complex'; columns?: number; spacing?: 'sm'|'md'|'lg' }
  | { type: 'popular-posts'; title?: string; description?: string; featuredPost?: { title?: string; excerpt?: string; imageUrl?: string; readTime?: string; publishDate?: string; category?: string }; sidePosts: Array<{ title?: string; excerpt?: string; imageUrl?: string; readTime?: string; publishDate?: string }> }
  | { type: 'breadcrumb'; enabled?: boolean; items: Array<{ label: string; href: string }>; style?: { separator?: '>'|'→'|'|'|'/'; textSize?: 'sm'|'base'|'lg'; showHomeIcon?: boolean; color?: 'gray'|'blue'|'black' } };

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  body?: string;
  featuredImage?: string | { url: string };
  featuredMedia?: {
    url: string;
    alt?: string;
    caption?: string;
    type: 'image' | 'video';
    width?: number;
    height?: number;
    duration?: number;
  };
  contentSections: ContentSection[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author?: string | {
    name: string;
    email?: string;
    [key: string]: any;
  };
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    noIndex?: boolean;
    noFollow?: boolean;
  };
  primaryCategory?: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    color: string;
    icon?: string;
    image?: {
      url: string;
      alt?: string;
    };
    parent?: string;
    parentId?: string;
    level: number;
    path: string;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
    order: number;
    navVisible: boolean;
    type: 'nav' | 'taxonomy';
    heroImageUrl?: string;
    seo: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
    };
    postCount: number;
    createdAt: string;
    updatedAt: string;
    url?: string;
    fullPath?: string[];
    childrenCount?: number;
    children?: any[];
  };
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
const ADMIN_BACKEND_URL = process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL || 'http://localhost:5000';

// Expect a public endpoint like GET /api/v1/posts/by-slug/:slug  (see note below if you need to add it)
export async function fetchPostBySlug(slug: string, { nextOptions }: { nextOptions?: RequestInit['next'] } = {}): Promise<PublicPost | null> {
  if (!slug) {
    console.error('❌ fetchPostBySlug: No slug provided');
    return null;
  }

  const url = `${BACKEND_URL}/api/posts/by-slug/${encodeURIComponent(slug)}`;
  console.log('🔍 fetchPostBySlug: Fetching from URL:', url);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // Disable caching to avoid 2MB limit
    });

    console.log('📡 fetchPostBySlug: Response status:', res.status, res.statusText);

    if (!res.ok) {
      console.error('❌ fetchPostBySlug: Response not OK:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('❌ fetchPostBySlug: Error response body:', errorText);
      return null;
    }

    const data = await res.json();
    console.log('📦 fetchPostBySlug: Response data:', data);

    // Accept either { success, data } or raw post
    const post = data?.data ?? data;
    console.log('📦 fetchPostBySlug: Extracted post:', post);

    if (!post?.slug) {
      console.error('❌ fetchPostBySlug: No post or slug found in response:', post);
      console.error('❌ fetchPostBySlug: Available keys in post:', post ? Object.keys(post) : 'post is null/undefined');
      return null;
    }

    console.log('✅ fetchPostBySlug: Successfully fetched post:', post.title);
    console.log('✅ fetchPostBySlug: Post slug:', post.slug);
    console.log('✅ fetchPostBySlug: Post author:', post.author);

    return {
      id: post._id || post.id,
      title: post.title,
      slug: post.slug,
      body: post.body || '',
      featuredImage: post.featuredImage,
      featuredMedia: post.featuredMedia,
      contentSections: Array.isArray(post.contentSections) ? post.contentSections : [],
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      author: post.author && typeof post.author === 'object'
        ? {
            name: [post.author.firstName, post.author.lastName].filter(Boolean).join(' ') || post.author.email || 'Unknown Author',
            email: post.author.email,
            ...post.author
          }
        : post.author || 'Unknown Author',
      tags: post.tags || [],
      seo: post.seo,
      primaryCategory: post.primaryCategory,
    };
  } catch (error) {
    console.error('❌ fetchPostBySlug: Network or parsing error:', error);
    return null;
  }
}

// Simple Post type
export type PublicSimplePost = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: {
    url: string;
    alt?: string;
    caption?: string;
  };
  tags: string[];
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  status: 'draft' | 'published' | 'archived';
  author?: {
    _id: string;
    fullname: string;
    email: string;
    avatar?: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    views: number;
    likes: number;
    shares: number;
  };
  readingTime?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
};

// Fetch simple post by slug
export async function fetchSimplePostBySlug(slug: string, { nextOptions }: { nextOptions?: RequestInit['next'] } = {}): Promise<PublicSimplePost | null> {
  if (!slug) {
    console.error('❌ fetchSimplePostBySlug: No slug provided');
    return null;
  }

  const url = `${ADMIN_BACKEND_URL}/api/v1/simple-posts/slug/${encodeURIComponent(slug)}`;
  console.log('🔍 fetchSimplePostBySlug: Fetching from URL:', url);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // Disable caching to avoid 2MB limit
    });

    console.log('📡 fetchSimplePostBySlug: Response status:', res.status, res.statusText);

    if (!res.ok) {
      console.error('❌ fetchSimplePostBySlug: Response not OK:', res.status, res.statusText);
      const errorText = await res.text();
      console.error('❌ fetchSimplePostBySlug: Error response body:', errorText);
      return null;
    }

    const data = await res.json();
    console.log('📦 fetchSimplePostBySlug: Response data:', data);

    // Accept either { success, data } or raw post
    const post = data?.data ?? data;
    console.log('📦 fetchSimplePostBySlug: Extracted post:', post);

    if (!post?.slug) {
      console.error('❌ fetchSimplePostBySlug: No post or slug found in response:', post);
      console.error('❌ fetchSimplePostBySlug: Available keys in post:', post ? Object.keys(post) : 'post is null/undefined');
      return null;
    }

    console.log('✅ fetchSimplePostBySlug: Successfully fetched simple post:', post.title);
    console.log('✅ fetchSimplePostBySlug: Post slug:', post.slug);
    console.log('✅ fetchSimplePostBySlug: Post author:', post.author);

    return {
      _id: post._id || post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      featuredImage: post.featuredImage,
      tags: post.tags || [],
      categories: post.categories || [],
      status: post.status,
      author: post.author,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      stats: post.stats || { views: 0, likes: 0, shares: 0 },
      readingTime: post.readingTime || 0,
      seo: post.seo,
    };
  } catch (error) {
    console.error('❌ fetchSimplePostBySlug: Network or parsing error:', error);
    return null;
  }
}
