import ContentPageClient from "./ContentPageClient";
import { getPageMetadata } from "../../lib/seo";

export const metadata = getPageMetadata("content");

export default function ContentPage() {
  return <ContentPageClient />;
}
