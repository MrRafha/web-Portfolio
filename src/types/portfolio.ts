export type Project = {
  title: string;
  category: string;
  description: string;
  stack: string[];
  highlights: string[];
  gallery: {
    title: string;
    caption: string;
    image: string;
  }[];
  href?: string;
  repo?: string;
  featured?: boolean;
};

export type TechGroup = {
  title: string;
  summary: string;
  focus: string;
  items: string[];
};

export type Profile = {
  name: string;
  role: string;
  headline: string;
  description: string;
  email: string;
  github: string;
  linkedin: string;
};

export type Stat = {
  label: string;
  value: string;
};
