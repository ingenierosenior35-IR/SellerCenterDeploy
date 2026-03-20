'use client';

import type { FeedbackAdapterInterface } from 'src/interfaces/feedback/feedback-adapter';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_REVIEWS_QUERY } from './graphql/queries/get-feedback';
import { FeedbackRequest, ReviewListResponse } from 'src/interfaces/feedback/feedback-list';
import { feedbackListAdapter } from './adapters/feedback-list-adapter';

export function useGetFeedback(request?: FeedbackRequest) {
  const graphql = GraphQLService.getInstance();
  const queryVariables = useMemo<FeedbackRequest>(
    () => {
      const variables: FeedbackRequest = {
        pageSize: request?.pageSize,
        currentPage: request?.currentPage,
      };

      if (request?.rating) {
        variables.rating = request.rating;
      }
      if (request?.filter?.isReviewApproved) {
        variables.filter = {
          ...variables.filter,
          isReviewApproved: request.filter.isReviewApproved,
        };
      }
      if (request?.filter?.rating) {
        variables.filter = {
          ...variables.filter,
          rating: request.filter.rating,
        };
      }
      return variables;
    },
    [
      request?.currentPage,
      request?.pageSize,
      request?.rating,
      request?.filter?.isReviewApproved?.eq,
      request?.filter?.rating?.eq,
    ]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'getReviews',
      queryVariables.rating && queryVariables.rating,
      queryVariables.pageSize,
      queryVariables.currentPage,
      queryVariables.filter?.isReviewApproved?.eq,
      queryVariables.filter?.rating?.eq,
    ],
    queryFn: () => graphql.request<ReviewListResponse, FeedbackRequest>(GET_REVIEWS_QUERY, queryVariables),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const reviews = useMemo<FeedbackAdapterInterface>(() => feedbackListAdapter(data), [data]);
  return { reviews, isLoading, isError };
}
