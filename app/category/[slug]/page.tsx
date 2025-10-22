import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { categoriesApi, postsApi } from '@/lib/api';
import { Category, Post } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCategory(slug: string): Promise<Category | null> {
  try {
    const response = await categoriesApi.getCategory(slug);
    return response;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getPostsByCategory(slug: string, page: number = 1, limit: number = 12) {
  try {
    const response = await categoriesApi.getPostsByCategorySlug(slug, {
      page,
      limit,
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    });
    return response;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return { data: [], meta: { pagination: { total: 0, pages: 0, page: 1 } } };
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: category.seo?.metaTitle || `${category.name} | Travel Blog`,
    description: category.seo?.metaDescription || category.description || `Explore ${category.name} content and travel guides.`,
    keywords: category.seo?.keywords?.join(', ') || category.name,
    openGraph: {
      title: category.seo?.metaTitle || `${category.name} | Travel Blog`,
      description: category.seo?.metaDescription || category.description || `Explore ${category.name} content and travel guides.`,
      images: category.heroImageUrl ? [{ url: category.heroImageUrl }] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page || 1);

  const category = await getCategory(slug);
  if (!category) {
    return notFound();
  }

  const { data: posts, meta } = await getPostsByCategory(slug, page);

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="mb-12">
        {category.heroImageUrl && (
          <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={category.heroImageUrl}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{category.name}</h1>
                {category.description && (
                  <p className="text-lg md:text-xl max-w-2xl mx-auto">{category.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {!category.heroImageUrl && (
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600">{category.description}</p>
            )}
          </div>
        )}
      </section>

      {/* Posts Grid */}
      <section className="mb-12">
        {posts.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post: Post) => (
                <Link 
                  key={post._id} 
                  href={`/content/${post.slug}`}
                  className="group block rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
                >
                  {post.featuredImage?.url && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author.name}</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat._id}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta.pagination.pages > 1 && (
              <nav className="flex justify-center mt-12">
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={`/category/${slug}?page=${page - 1}`}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  
                  {Array.from({ length: meta.pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/category/${slug}?page=${pageNum}`}
                      className={`px-4 py-2 border rounded transition-colors ${
                        pageNum === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}
                  
                  {page < meta.pagination.pages && (
                    <Link
                      href={`/category/${slug}?page=${page + 1}`}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No posts found</h2>
            <p className="text-gray-500">Check back later for new content in this category.</p>
          </div>
        )}
      </section>
    </main>
  );
}

