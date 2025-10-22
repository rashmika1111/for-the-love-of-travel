import { Metadata } from 'next';
import SimplePostsClient from './SimplePostsClient';

export const metadata: Metadata = {
  title: 'Simple Posts - For Love of Travel',
  description: 'Quick and simple travel posts with beautiful images and engaging content.',
  openGraph: {
    title: 'Simple Posts - For Love of Travel',
    description: 'Quick and simple travel posts with beautiful images and engaging content.',
    type: 'website',
  },
};

export default function SimplePostsPage() {
  return <SimplePostsClient />;
}


