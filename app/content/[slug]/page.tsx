import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPostBySlug } from '../../../lib/cms';
import { categoriesApi } from '../../../lib/api';
import ContentPageClient from './ContentPageClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the post
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await fetchPostBySlug(slug, { nextOptions: { revalidate: 60 } });
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
      };
    }

    // Get category information for breadcrumbs
    let categoryBreadcrumb = '';
    if (post.primaryCategory) {
      try {
        const category = await categoriesApi.getCategory(post.primaryCategory.slug);
        categoryBreadcrumb = category.name;
      } catch (error) {
        console.error('Error fetching category for breadcrumb:', error);
      }
    }

    const title = post.seo?.metaTitle || post.title;
    const description = post.seo?.metaDescription || (post.body ? post.body.replace(/<[^>]*>/g, '').slice(0, 160) : undefined);
    const keywords = post.seo?.keywords?.join(', ') || (post.tags ? post.tags.join(', ') : undefined);

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description: post.seo?.metaDescription || (post.body ? post.body.replace(/<[^>]*>/g, '').slice(0, 200) : undefined),
        images: post.featuredImage
          ? [typeof post.featuredImage === 'string' ? post.featuredImage : post.featuredImage.url]
          : undefined,
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [typeof post.author === 'object' && post.author?.name ? post.author.name : (post.author as string) || 'Unknown Author'],
        section: categoryBreadcrumb,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.featuredImage
          ? [typeof post.featuredImage === 'string' ? post.featuredImage : post.featuredImage.url]
          : undefined,
      },
      alternates: {
        canonical: post.seo?.canonicalUrl || `/content/${slug}`,
      },
      robots: {
        index: !post.seo?.noIndex,
        follow: !post.seo?.noFollow,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }
}

// Generate static params for popular posts
export async function generateStaticParams() {
  try {
    // For now, return empty array to avoid build-time API calls
    // This can be enhanced later to pre-generate popular posts
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PostPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    console.log('🔍 PostPage: Fetching post with slug:', slug);
    
    const post = await fetchPostBySlug(slug, { nextOptions: { revalidate: 60 } });
    
    if (!post) {
      console.error('❌ PostPage: No post found for slug:', slug);
      notFound();
    }

    console.log('✅ PostPage: Successfully loaded post:', post.title);

    return <ContentPageClient post={post} />;
  } catch (error) {
    console.error('❌ PostPage: Error fetching post:', error);
    notFound();
  }
}
