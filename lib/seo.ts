import type { Metadata } from "next";

export const SITE_NAME = "Dashboard Tax Center Gunadarma";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dashboard.taxcenterug.com";
export const DEFAULT_OG_IMAGE = "/og_image.jpg";

type CreatePageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function absoluteAssetUrl(path: string) {
  return absoluteUrl(path);
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: CreatePageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const fullTitle = `${title} | ${SITE_NAME}`;
  const ogImage = absoluteAssetUrl(DEFAULT_OG_IMAGE);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            "max-image-preview": "none",
            "max-video-preview": -1,
            "max-snippet": -1,
          },
        }
      : undefined,
  };
}
