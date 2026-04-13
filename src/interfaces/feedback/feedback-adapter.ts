/* c8 ignore file */
/* istanbul ignore file */

export interface FeedbackAdapterInterface {
    feedbackListAdapter: FeedbackItems[]
}

export interface FeedbackItems {
  average_rating: number
  created_at: string
  nickname: string
  summary: string
  text: string
  ratings_breakdown: RatingsBreakdown[]
  status: any
  sku: string
  review_count: number
  rating_summary: number
  name: string
  image: string,
}

export interface RatingsBreakdown {
  name: string
  value: string
}
// export interface Image {
//   url: string
// }
