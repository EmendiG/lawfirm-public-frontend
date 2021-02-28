export class BlogPost
{

  id?:number
  title:string;
  category:string;
  pictureUrl:string;
  pictureSize:string;
  pictureDescription?:string;
  description:string;
  content:string;
  tags:string;
  author:string;
  postTime?:string;

  _links?:any

}

export interface GetResponseBlogPosts {
  _embedded: {
    blogPosts: BlogPost[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
