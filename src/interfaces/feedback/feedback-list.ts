/* c8 ignore file */
/* istanbul ignore file */

export interface ReviewListResponse {
  sellerProducts: SellerProducts;
  total_count: number;
}

export interface SellerProducts {
  items: Item[];
}

export interface Item {
  reviews: Reviews;
  review_count: number;
  image: Image;
  name: string;
  sku: string;
  rating_summary: number;
}

export interface Reviews {
  items: Item2[];
}

export interface Item2 {
  average_rating: number;
  created_at: string;
  nickname: string;
  summary: string;
  text: string;
  ratings_breakdown: RatingsBreakdown[];
  status: any;
}

export interface RatingsBreakdown {
  name: string;
  value: string;
}

export interface Image {
  url: string;
}

export interface FeedbackRequest {
  pageSize?: number;
  currentPage?: number;
  rating?: string;
  filter?: Filter;
  sort?: SortOption;
}
export interface Filter {
  isReviewApproved?: { eq: string };
  rating?: { eq: string };
}
export interface SortOption {
  rating?: 'asc' | 'desc';
  created_at?: 'asc' | 'desc';
}

export interface FeedbackTableFormated{
    created_at: string
    nickname: string
    text: string
    price: string
    value: string
    quality: string
    status: any
    sku: string
    name: string
    image: string,
    sumary: string
}
