export interface PostMeta {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  author: string;
  date: string;
}

export interface CompletePost extends PostMeta {
  content?: string;
}
