import HomePageClient from "./HomePageClient";
import { getPageMetadata } from "../lib/seo";

export const metadata = getPageMetadata("home");

export default function Page() {
  return <HomePageClient />;
}
