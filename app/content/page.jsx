import ContentPageClient from "./ContentPageClient";
import { getPageMetadata } from "../../lib/seo";

export const metadata = getPageMetadata("content");

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ContentPage() {
  return <ContentPageClient />;
}
