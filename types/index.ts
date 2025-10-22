// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    filters?: Record<string, any>;
    cached?: boolean;
    timestamp: string;
    [key: string]: any;
  };
  message?: string;
  code?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Post Types
export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: {
    url: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
  };
  featuredMedia?: {
    url: string;
    alt?: string;
    caption?: string;
    type: 'image' | 'video';
    width?: number;
    height?: number;
    duration?: number;
  };
  tags: string[];
  categories: Category[];
  primaryCategory?: Category;
  author: Author;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  publishedAt: string;
  scheduledAt?: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    noIndex?: boolean;
    noFollow?: boolean;
  };
  contentSections: ContentSection[];
  breadcrumb: BreadcrumbItem[];
  readingTime: number;
  wordCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isPinned: boolean;
  isFeatured: boolean;
  allowComments: boolean;
  allowSharing: boolean;
  socialSharing: {
    facebook: boolean;
    twitter: boolean;
    linkedin: boolean;
    pinterest: boolean;
    whatsapp: boolean;
  };
  relatedPosts: Post[];
  version: number;
  createdAt: string;
  updatedAt: string;
  url?: string;
  formattedPublishedDate?: string;
  readingTimeText?: string;
}

export interface ContentSection {
  type: 'text' | 'image' | 'video' | 'gallery' | 'quote' | 'code' | 'hero' | 'testimonial';
  content: any;
  order: number;
  metadata?: Record<string, any>;
}

export interface BreadcrumbItem {
  title: string;
  url: string;
  position: number;
}

// Category Types
export interface Category {
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
  children?: Category[];
}

// Author Types
export interface Author {
  _id: string;
  name: string;
  slug: string;
  email: string;
  bio?: string;
  shortBio?: string;
  avatar?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  coverImage?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  socialLinks: {
    website?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  expertise: string[];
  specializations: string[];
  languages: string[];
  location: {
    city?: string;
    country?: string;
    timezone?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  role: 'author' | 'editor' | 'admin' | 'contributor' | 'guest';
  permissions: {
    canPublish: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canModerate: boolean;
  };
  stats: {
    postCount: number;
    publishedPostCount: number;
    draftPostCount: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    averageReadingTime: number;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  preferences: {
    emailNotifications: boolean;
    commentNotifications: boolean;
    postNotifications: boolean;
    newsletter: boolean;
  };
  lastActiveAt: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  url?: string;
  displayName?: string;
  formattedJoinDate?: string;
  formattedLastActive?: string;
}

// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  role: 'super_admin' | 'admin' | 'editor' | 'author' | 'moderator' | 'user';
  permissions: {
    canCreatePosts: boolean;
    canEditPosts: boolean;
    canDeletePosts: boolean;
    canPublishPosts: boolean;
    canManageCategories: boolean;
    canManageTags: boolean;
    canManageAuthors: boolean;
    canManageUsers: boolean;
    canModerateComments: boolean;
    canViewAnalytics: boolean;
    canManageSettings: boolean;
    canManageMedia: boolean;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  lastLoginIP?: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
  };
  profile: {
    bio?: string;
    website?: string;
    location?: string;
    socialLinks: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
  stats: {
    loginCount: number;
    postsCreated: number;
    postsPublished: number;
    commentsModerated: number;
  };
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  displayName?: string;
  formattedJoinDate?: string;
  formattedLastLogin?: string;
}

// Comment Types
export interface Comment {
  _id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    website?: string;
    avatar?: string;
  };
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  parentId?: string;
  depth: number;
  likes: number;
  dislikes: number;
  reports: number;
  isEdited: boolean;
  editedAt?: string;
  moderation: {
    moderatedBy?: string;
    moderatedAt?: string;
    moderationReason?: string;
    autoModerated: boolean;
  };
  metadata: {
    ip?: string;
    userAgent?: string;
    country?: string;
    city?: string;
    referrer?: string;
    spamScore: number;
  };
  createdAt: string;
  approvedAt?: string;
  updatedAt: string;
  formattedDate?: string;
  replyCount?: number;
  netScore?: number;
}

// Analytics Types
export interface Analytics {
  _id: string;
  type: 'view' | 'click' | 'search' | 'scroll' | 'exit' | 'form_submit' | 'download' | 'video_play' | 'video_complete';
  path: string;
  data: {
    element?: string;
    query?: string;
    duration?: number;
    scrollDepth?: number;
    formName?: string;
    fileName?: string;
    videoId?: string;
    videoDuration?: number;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    custom?: any;
  };
  userId?: string;
  sessionId: string;
  ip: string;
  userAgent: string;
  metadata: {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
    device?: string;
    browser?: string;
    os?: string;
    screenResolution?: string;
    language?: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  timestamp: string;
  value: number;
  formattedTimestamp?: string;
}

// Search Types
export interface SearchFilters {
  query?: string;
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  pinned?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  posts: Post[];
  categories: Category[];
  authors: Author[];
  tags: Tag[];
  pagination: PaginationMeta;
  filters: SearchFilters;
}

// Tag Types
export interface Tag {
  name: string;
  slug: string;
  count: number;
}

// Contact Types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
  preferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
}

// API Error Types
export interface ApiError {
  success: false;
  message: string;
  code: string;
  details?: any;
}

// Component Props Types
export interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact' | 'grid';
  showAuthor?: boolean;
  showCategories?: boolean;
  showExcerpt?: boolean;
  showStats?: boolean;
}

export interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'featured' | 'compact';
  showPostCount?: boolean;
  showDescription?: boolean;
}

export interface AuthorCardProps {
  author: Author;
  variant?: 'default' | 'featured' | 'compact';
  showStats?: boolean;
  showBio?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  preferences?: {
    categories?: string[];
    frequency?: string;
  };
}

// SEO Types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}

// Utility Types
export type SortOrder = 'asc' | 'desc';

export type PostStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'author' | 'moderator' | 'user';

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

export type AnalyticsType = 'view' | 'click' | 'search' | 'scroll' | 'exit' | 'form_submit' | 'download' | 'video_play' | 'video_complete';

// API Endpoint Types
export interface PostsResponse extends ApiResponse<Post[]> {}
export interface PostResponse extends ApiResponse<Post> {}
export interface CategoriesResponse extends ApiResponse<Category[]> {}
export interface CategoryResponse extends ApiResponse<Category> {}
export interface AuthorsResponse extends ApiResponse<Author[]> {}
export interface AuthorResponse extends ApiResponse<Author> {}
export interface CommentsResponse extends ApiResponse<Comment[]> {}
export interface CommentResponse extends ApiResponse<Comment> {}
export interface SearchResponse extends ApiResponse<SearchResult> {}
export interface AnalyticsResponse extends ApiResponse<Analytics[]> {}

