import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchSimplePostBySlug } from '../../../lib/cms';
import SimplePostClient from './SimplePostClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the simple post
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await fetchSimplePostBySlug(slug, { nextOptions: { revalidate: 60 } });
    
    if (!post) {
      return {
        title: 'Simple Post Not Found',
        description: 'The requested simple post could not be found.',
      };
    }

    const title = post.seo?.metaTitle || post.title;
    const description = post.seo?.metaDescription || post.content.replace(/<[^>]*>/g, '').slice(0, 160);
    const keywords = post.tags ? post.tags.join(', ') : undefined;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        images: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author?.fullname || 'Unknown Author'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
      },
      alternates: {
        canonical: `/simple/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Simple Post Not Found',
      description: 'The requested simple post could not be found.',
    };
  }
}

// Generate static params for popular simple posts
export async function generateStaticParams() {
  try {
    // For now, return empty array to avoid build-time API calls
    // This can be enhanced later to pre-generate popular simple posts
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function SimplePostPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    console.log('🔍 SimplePostPage: Fetching simple post with slug:', slug);
    
    const post = await fetchSimplePostBySlug(slug, { nextOptions: { revalidate: 60 } });
    
    if (!post) {
      console.error('❌ SimplePostPage: No simple post found for slug:', slug);
      notFound();
    }

    console.log('✅ SimplePostPage: Successfully loaded simple post:', post.title);

    return <SimplePostClient post={post} />;
  } catch (error) {
    console.error('❌ SimplePostPage: Error fetching simple post:', error);
    notFound();
  }
}


