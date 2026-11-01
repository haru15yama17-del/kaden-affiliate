import type { Metadata } from "next";
import "./globals.css";
import { ArticleNavigation } from "@/components/ArticleNavigation";
import { NavigationTracking } from "@/components/NavigationTracking";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/data/site";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  verification: {
    google: "y5exJqVbjDJMOL-5MhSbDgCL90xMZnaqLNWvR6Z5NhE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only">本文へ移動</a>
        <SiteHeader />
        <main id="main-content" className="site-main">{children}</main>
        <ArticleNavigation />
        <NavigationTracking />
        <SiteFooter />
      </body>
      <GoogleAnalytics gaId="G-WLDBPK4BGB" />
    </html>
  );
}
