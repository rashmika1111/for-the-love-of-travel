// API Configuration and utilities
import type { 
  ApiResponse, 
  Post, 
  Category, 
  Author, 
  Comment, 
  SearchFilters, 
  SearchResult,
  ContactFormData,
  NewsletterFormData,
  PostsResponse,
  PostResponse,
  CategoriesResponse,
  AuthorsResponse,
  AuthorResponse,
  CommentsResponse,
  SearchResponse
} from '../types';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Debug logging for API calls
const DEBUG_API = process.env.NODE_ENV === 'development';

// API Endpoints
export const API_ENDPOINTS = {
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  posts: '/api/posts',
  videos: '/api/videos',

  categories: '/api/categories',
  tags: '/api/tags',
  authors: '/api/authors',
  search: '/api/search',
  analytics: '/api/analytics',
  health: '/health',
  
  // New endpoints for dynamic popular posts
  viewAnalytics: '/api/v1/analytics',
  homepageSections: '/api/v1/homepage-sections'
};

// API Response handler

export const handleApiResponse = async <T = any>(response: Response, url?: string): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`❌ API Error for ${url}:`, {
      status: response.status,
      statusText: response.statusText,
      url: url,
      errorData: errorData
    });

    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Generic API request function
export const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  

  if (DEBUG_API) {
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  }
  

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {

    const response = await fetch(url, config);
    
    if (DEBUG_API) {
      console.log(`📡 API Response: ${response.status} ${response.statusText} for ${url}`);
    }
    
    return await handleApiResponse<T>(response, url);
  } catch (error) {
    if (DEBUG_API) {
      console.error(`❌ API request failed for ${url}:`, error);
    }

    throw error;
  }
};

// Contact API functions
export const contactApi = {
  submitContact: async (contactData: ContactFormData): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.contact, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// Newsletter API functions
export const newsletterApi = {
  subscribe: async (email: string, preferences: any = {}): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.newsletter, {
      method: 'POST',
      body: JSON.stringify({ email, preferences }),
    });
  },
  unsubscribe: async (email: string, reason?: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.newsletter}/unsubscribe`, {
      method: 'POST',
      body: JSON.stringify({ email, reason }),
    });
  },
};

// Posts API functions
export const postsApi = {
  getPosts: async (params: SearchFilters = {}): Promise<PostsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.posts}?${queryString}` : API_ENDPOINTS.posts;
    return apiRequest<PostsResponse>(endpoint);
  },
  getPost: async (slug: string): Promise<PostResponse> => {
    return apiRequest<PostResponse>(`${API_ENDPOINTS.posts}/${slug}`);
  },
  getPopularPosts: async (limit: number = 10, timeframe: string = '30d'): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.posts}/popular?limit=${limit}&timeframe=${timeframe}`);
  },
  getFeaturedPosts: async (limit: number = 5): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.posts}/featured?limit=${limit}`);
  },
  getPinnedPosts: async (limit: number = 3): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.posts}/pinned?limit=${limit}`);
  },
  getRecentPosts: async (limit: number = 10): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.posts}/recent?limit=${limit}`);
  },

  getLatestPostCards: async (limit: number = 7): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.posts}?limit=${limit}&sortBy=createdAt&sortOrder=desc`);
  },

  getRelatedPosts: async (postId: string, limit: number = 5): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.posts}/${postId}/related?limit=${limit}`);
  },
  searchPosts: async (query: string, params: SearchFilters = {}): Promise<PostsResponse> => {
    const searchParams = { q: query, ...params };
    const queryString = new URLSearchParams(
      Object.entries(searchParams)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.posts}/search/${encodeURIComponent(query)}?${queryString}`);
  },
  likePost: async (postId: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.posts}/${postId}/like`, {
      method: 'POST',
    });
  },
  unlikePost: async (postId: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.posts}/${postId}/unlike`, {
      method: 'POST',
    });
  },
  sharePost: async (postId: string, platform: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.posts}/${postId}/share`, {
      method: 'POST',
      body: JSON.stringify({ platform }),
    });
  },
};


// Videos API functions
export const videosApi = {
  getPopularVideos: async (limit: number = 4): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.videos}/popular?limit=${limit}`);
  },
  getFeaturedVideos: async (limit: number = 3): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.videos}/featured?limit=${limit}`);
  },
  getRecentVideos: async (limit: number = 6): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.videos}/recent?limit=${limit}`);
  },
  getVideos: async (params: SearchFilters = {}): Promise<PostsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.videos}?${queryString}` : API_ENDPOINTS.videos;
    return apiRequest<PostsResponse>(endpoint);
  },
  getVideoById: async (videoId: string): Promise<PostResponse> => {
    return apiRequest<PostResponse>(`${API_ENDPOINTS.videos}/${videoId}`);
  },
  searchVideos: async (query: string, params: SearchFilters = {}): Promise<PostsResponse> => {
    const searchParams = { q: query, ...params };
    const queryString = new URLSearchParams(
      Object.entries(searchParams)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.videos}/search?${queryString}`);
  },
  likeVideo: async (videoId: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.videos}/${videoId}/like`, {
      method: 'POST',
    });
  },
  unlikeVideo: async (videoId: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.videos}/${videoId}/unlike`, {
      method: 'POST',
    });
  },
  shareVideo: async (videoId: string, platform: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.videos}/${videoId}/share`, {
      method: 'POST',
      body: JSON.stringify({ platform }),
    });
  },
  getVideoStats: async (videoId: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.videos}/${videoId}/stats`);
  },
  getVideoComments: async (videoId: string, params: { page?: number; limit?: number } = {}): Promise<ApiResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.videos}/${videoId}/comments?${queryString}` : `${API_ENDPOINTS.videos}/${videoId}/comments`;
    return apiRequest<ApiResponse>(endpoint);
  },
  addVideoComment: async (videoId: string, commentData: { content: string; parentId?: string }): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.videos}/${videoId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
};


// Categories API functions
export const categoriesApi = {
  getCategories: async (): Promise<CategoriesResponse> => {
    return apiRequest<CategoriesResponse>(API_ENDPOINTS.categories);
  },
  getCategoryTree: async (): Promise<{ success: boolean; data: Category[]; meta: any }> => {
    return apiRequest<{ success: boolean; data: Category[]; meta: any }>(`${API_ENDPOINTS.categories}/tree`);
  },
  getCategory: async (slug: string): Promise<Category> => {
    return apiRequest<Category>(`${API_ENDPOINTS.categories}/${slug}`);
  },
  getPostsByCategory: async (slug: string, params: SearchFilters = {}): Promise<PostsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.categories}/${slug}/posts?${queryString}` 
      : `${API_ENDPOINTS.categories}/${slug}/posts`;
    return apiRequest<PostsResponse>(endpoint);
  },
  getPostsByCategorySlug: async (slug: string, params: SearchFilters = {}): Promise<PostsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries({ category: slug, ...params })
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.posts}?${queryString}` 
      : `${API_ENDPOINTS.posts}?category=${slug}`;
    return apiRequest<PostsResponse>(endpoint);
  },
};

// Authors API functions
export const authorsApi = {
  getAuthors: async (params: {
    featured?: boolean;
    role?: string;
    search?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<AuthorsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.authors}?${queryString}` : API_ENDPOINTS.authors;
    return apiRequest<AuthorsResponse>(endpoint);
  },
  getAuthor: async (slug: string): Promise<AuthorResponse> => {
    return apiRequest<AuthorResponse>(`${API_ENDPOINTS.authors}/${slug}`);
  },
  getFeaturedAuthors: async (limit: number = 6): Promise<AuthorsResponse> => {
    return apiRequest<AuthorsResponse>(`${API_ENDPOINTS.authors}/featured?limit=${limit}`);
  },
  getTopAuthorsByPosts: async (limit: number = 10): Promise<AuthorsResponse> => {
    return apiRequest<AuthorsResponse>(`${API_ENDPOINTS.authors}/top/posts?limit=${limit}`);
  },
  getTopAuthorsByViews: async (limit: number = 10): Promise<AuthorsResponse> => {
    return apiRequest<AuthorsResponse>(`${API_ENDPOINTS.authors}/top/views?limit=${limit}`);
  },
  getAuthorPosts: async (slug: string, params: SearchFilters = {}): Promise<PostsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.authors}/${slug}/posts?${queryString}` 
      : `${API_ENDPOINTS.authors}/${slug}/posts`;
    return apiRequest<PostsResponse>(endpoint);
  },
  getAuthorPopularPosts: async (slug: string, limit: number = 5): Promise<PostsResponse> => {
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.authors}/${slug}/posts/popular?limit=${limit}`);
  },
  getAuthorStats: async (slug: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.authors}/${slug}/stats`);
  },
  searchAuthors: async (query: string, params: {
    limit?: number;
    role?: string;
  } = {}): Promise<AuthorsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.authors}/search/${encodeURIComponent(query)}?${queryString}` 
      : `${API_ENDPOINTS.authors}/search/${encodeURIComponent(query)}`;
    return apiRequest<AuthorsResponse>(endpoint);
  },
};

// Tags API functions
export const tagsApi = {
  getTags: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.tags);
  },
  getPostsByTag: async (slug: string, params: SearchFilters = {}): Promise<PostsResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.tags}/${slug}/posts?${queryString}` 
      : `${API_ENDPOINTS.tags}/${slug}/posts`;
    return apiRequest<PostsResponse>(endpoint);
  },
};

// Search API functions
export const searchApi = {
  search: async (query: string, params: SearchFilters = {}): Promise<SearchResponse> => {
    const searchParams = { q: query, ...params };
    const queryString = new URLSearchParams(
      Object.entries(searchParams)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return apiRequest<SearchResponse>(`${API_ENDPOINTS.search}?${queryString}`);
  },
};

// Analytics API functions
export const analyticsApi = {
  trackEvent: async (eventData: {
    type: string;
    path: string;
    data?: any;
  }): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.analytics, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },
  trackPageView: async (pageData: {
    path: string;
    title?: string;
    referrer?: string;
  }): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.analytics}/pageview`, {
      method: 'POST',
      body: JSON.stringify(pageData),
    });
  },
};

// View Analytics API functions
export const viewAnalyticsApi = {
  trackView: async (postId: string, postType: 'post' | 'simplePost' = 'post'): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.viewAnalytics}/track-view`, {
      method: 'POST',
      body: JSON.stringify({ postId, postType }),
    });
  },
  getPopularPostsWithAnalytics: async (
    limit: number = 10,
    timeframe: string = '30d',
    algorithm: string = 'weighted',
    postType: string = 'all'
  ): Promise<PostsResponse> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      timeframe,
      algorithm,
      postType
    });
    return apiRequest<PostsResponse>(`${API_ENDPOINTS.viewAnalytics}/popular-posts?${params}`);
  },
  getPostAnalytics: async (postId: string, postType: 'post' | 'simplePost' = 'post'): Promise<ApiResponse> => {
    const params = new URLSearchParams({ postType });
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.viewAnalytics}/post/${postId}?${params}`);
  },
  getAnalyticsDashboard: async (timeframe: string = '30d'): Promise<ApiResponse> => {
    const params = new URLSearchParams({ timeframe });
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.viewAnalytics}/dashboard?${params}`);
  },
};

// Homepage Sections API functions
export const homepageSectionsApi = {
  getHomepageSections: async (params: {
    type?: string;
    isActive?: boolean;
    isPublished?: boolean;
    includeData?: boolean;
  } = {}): Promise<ApiResponse> => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.homepageSections}?${queryString}` : API_ENDPOINTS.homepageSections;
    return apiRequest<ApiResponse>(endpoint);
  },
  getPublishedHomepageSections: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/published`);
  },
  getHomepageSection: async (id: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/${id}`);
  },
  createHomepageSection: async (sectionData: any): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(API_ENDPOINTS.homepageSections, {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  },
  updateHomepageSection: async (id: string, sectionData: any): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
  },
  deleteHomepageSection: async (id: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/${id}`, {
      method: 'DELETE',
    });
  },
  reorderHomepageSections: async (sections: Array<{ id: string }>): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ sections }),
    });
  },
  publishHomepageSection: async (id: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/${id}/publish`, {
      method: 'PATCH',
    });
  },
  unpublishHomepageSection: async (id: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/${id}/unpublish`, {
      method: 'PATCH',
    });
  },
  toggleSectionActive: async (id: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/${id}/toggle-active`, {
      method: 'PATCH',
    });
  },
  duplicateHomepageSection: async (id: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/${id}/duplicate`, {
      method: 'POST',
    });
  },
  getHomepageSectionAnalytics: async (id: string, timeframe: string = '30d'): Promise<ApiResponse> => {
    const params = new URLSearchParams({ timeframe });
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/${id}/analytics?${params}`);
  },
  updateHomepageSectionAnalytics: async (id: string, type: 'view' | 'click' | 'engagement', value: number = 1): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`${API_ENDPOINTS.homepageSections}/${id}/analytics`, {
      method: 'PATCH',
      body: JSON.stringify({ type, value }),
    });
  },
};

// Health check
export const healthCheck = async (): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>(API_ENDPOINTS.health);
};

const api = {
  contactApi,
  newsletterApi,
  postsApi,
  videosApi,
  categoriesApi,
  authorsApi,
  tagsApi,
  searchApi,
  analyticsApi,
  viewAnalyticsApi,
  homepageSectionsApi,
  healthCheck,
};

export default api;
