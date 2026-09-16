import type { Image, PortableTextBlock } from "sanity";

export type SanityProject = {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  sector?: string;
  year?: string;
  plan?: string;
  deliveredIn?: string;
  cover?: Image & { alt?: string };
  gallery?: (Image & { alt?: string })[];
  services?: string[];
  results?: { value: string; label: string }[];
  url?: string;
  body?: PortableTextBlock[];
};

export type SanityPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  topic?: string;
  cover?: Image & { alt?: string };
  body?: PortableTextBlock[];
};

export type SanityTestimonial = {
  _id: string;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  rating?: number;
  avatar?: Image;
};
