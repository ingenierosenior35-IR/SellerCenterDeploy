import type { TableHeadCellProps } from 'src/components';
import type { FeedbackRequest, FeedbackTableFormated } from 'src/interfaces/feedback/feedback-list';

import { useState } from 'react';

import { useTranslate } from 'src/locales';
import { useGetFeedback } from 'src/actions/feedback/useGetFeedback';

export function useFeedbackList() {
  const [sendFilter, setSendFilter] = useState<FeedbackRequest>({});
  const { reviews, isError, isLoading } = useGetFeedback(sendFilter);
  const dataTableFormated: FeedbackTableFormated[] = [];
  const { translate } = useTranslate();

  reviews?.feedbackListAdapter.forEach((item) => {
    dataTableFormated.push({
      created_at: item.created_at,
      image: item.image,
      nickname: item.nickname,
      price: item.ratings_breakdown.filter((rating) => rating.name === 'Price')[0]?.value || 'N/A',
      value: item.ratings_breakdown.filter((rating) => rating.name === 'Value')[0]?.value || 'N/A',
      quality:
        item.ratings_breakdown.filter((rating) => rating.name === 'Quality')[0]?.value || 'N/A',
      name: item.name,
      sku: item.sku,
      status: item.status,
      text: item.text,
      sumary: item.summary,
    });
  });
  const handleFilterClick = (rating: string = '4') => {
    setSendFilter({ filter: { rating: { eq: rating } } });
  };
  const tableHead: TableHeadCellProps[] = [
    { id: 'sku', label: `${translate('feedbackModule.table.columns.sku')}`, width: 150 },
    { id: 'image', label: `${translate('feedbackModule.table.columns.image')}`, width: 150 },
    { id: 'name', label: `${translate('feedbackModule.table.columns.name')}`, width: 500 },
    { id: 'price', label: `${translate('feedbackModule.table.columns.price')}`, width: 150 },
    { id: 'value', label: `${translate('feedbackModule.table.columns.value')}`, width: 150 },
    { id: 'quality', label: `${translate('feedbackModule.table.columns.quality')}`, width: 150 },
    { id: 'comment', label: `${translate('feedbackModule.table.columns.comment')}`, width: 500 },
    { id: 'review', label: `${translate('feedbackModule.table.columns.review')}`, width: 150 },
    { id: 'nickName', label: `${translate('feedbackModule.table.columns.nickName')}`, width: 250 },
    { id: 'status', label: `${translate('feedbackModule.table.columns.status')}`, width: 150 },
    { id: 'created', label: `${translate('feedbackModule.table.columns.created')}`, width: 150 },
  ];
  return {
    reviewsList: dataTableFormated,
    isError,
    isLoading,
    tableHead,
    handleFilterClick,
  };
}
