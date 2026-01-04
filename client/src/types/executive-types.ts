export interface Executive {
  name: string;
  position: string;
  image: string;
  socials: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    github?: string;
  };
}

export type ExecutivesData = { [year: string]: Executive[] };
