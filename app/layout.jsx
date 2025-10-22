import "./globals.css";
import { Inter, Playfair_Display, Roboto } from "next/font/google";
import { defaultMetadata } from "../lib/seo";
import { Toaster } from "react-hot-toast";
import GoogleTagManager, { GoogleTagManagerNoScript } from "../components/GoogleTagManager";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const roboto = Roboto({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto" 
});

export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <GoogleTagManager gtmId={gtmId} />
      </head>
      <body 
        className={`${inter.variable} ${playfair.variable} ${roboto.variable} bg-white text-brand-ink antialiased`}
        suppressHydrationWarning={true}
      >
        <GoogleTagManagerNoScript gtmId={gtmId} />
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}