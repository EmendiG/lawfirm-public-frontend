export class BlogComment
{

  id?:number
  author:string;
  content:string;
  postId: number;
  commentId?: number;
  commentTime?: string;

  parentId?:number;
  mainParentId?: number;
  mainCommentId?:number;

}


export interface GetResponseBlogComments {
  _embedded: {
    blogComments: BlogComment[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
