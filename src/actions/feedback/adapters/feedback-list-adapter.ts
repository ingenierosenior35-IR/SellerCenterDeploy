import type { Item2, ReviewListResponse } from 'src/interfaces/feedback/feedback-list';

import { CONFIG } from 'src/global-config';
import { FeedbackAdapterInterface, FeedbackItems } from 'src/interfaces/feedback/feedback-adapter';

export function feedbackListAdapter(data: ReviewListResponse | undefined): FeedbackAdapterInterface {
  if (!data?.sellerProducts?.items) {
    console.warn('No reviews found');
    return { feedbackListAdapter: [] };
  }
  const arrayFormated: FeedbackItems[] = [];

  data.sellerProducts.items.forEach((item) => {
    item.reviews.items.map((review) => {
      if (review.ratings_breakdown.length > 0) {
        arrayFormated.push({
          average_rating: review.average_rating,
          created_at: review.created_at,
          nickname: review.nickname,
          summary: review.summary,
          image: item.image?.url ?? `${CONFIG.assetsDir}/assets/images/img-not-found.jpg`,
          name: item.name,
          rating_summary: item.rating_summary,
          review_count: item.review_count,
          sku: item.sku,
          ratings_breakdown: review.ratings_breakdown,
          status: review.status,
          text: review.text,
        });
      }
    });
  });

  return { feedbackListAdapter: arrayFormated };
}
