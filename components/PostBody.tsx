// Example usage of ContentSectionsRenderer in a post page
import React from 'react';
import ContentSectionsRenderer from './ContentSectionsRenderer';
import type { ContentSection } from '@/lib/cms';

interface PostBodyProps {
  post: {
    body?: string;
    contentSections?: ContentSection[];
  };
}

export function PostBody({ post }: PostBodyProps) {
  return (
    <div>
      {/* Render the main body content (TipTap HTML) */}
      <article dangerouslySetInnerHTML={{ __html: post.body ?? '' }} />
      
      {/* Render optional content sections */}
      <ContentSectionsRenderer sections={post.contentSections || []} />
    </div>
  );
}

