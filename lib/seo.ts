import type { Metadata } from "next";
import { site } from "@/data/site";

interface SeoInput {
  title: string;
  description: string;
  path: string;          // 例：/reviews/xxx
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildMetadata(input: SeoInput): Metadata {
  const url = `${site.url}${input.path}`;
  const ogImageUrl = input.image
    ? input.image
    : `${site.url}/api/og?t=${encodeURIComponent(input.title)}`;
  const ogImage = { url: ogImageUrl, width: 1200, height: 630, alt: input.title };

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: site.name,
      type: input.type ?? "website",
      images: [ogImage],
      locale: "ja_JP",
      ...(input.publishedTime && { publishedTime: input.publishedTime }),
      ...(input.modifiedTime && { modifiedTime: input.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImageUrl],
    },
  };
}
