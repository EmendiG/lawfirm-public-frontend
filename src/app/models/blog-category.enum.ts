import { BlogPost } from "./blog-post.model";

// at the same time update blog editor html
export enum BlogCategoryEnum {
  przedsiebiorca = "XXXXXX",
  nowe_technologie = "XXXXX XXXXX",
  nieruchomosci = "XXXXXX"
}


export interface GetResponseBlogCategorized {

  content: BlogPost[],
  pageable: {
    pageNumber: number,
    pageSize: number,
  }
  totalElements: number

}
