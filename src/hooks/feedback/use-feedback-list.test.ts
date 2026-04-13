import React from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetFeedback } from 'src/actions/feedback/use-get-feedback';

import { useFeedbackList } from './use-feedback-list';

jest.mock('src/actions/feedback/use-get-feedback', () => ({
  useGetFeedback: jest.fn(),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (ns: string, key?: string) => (key ? `${ns}.${key}` : ns),
    currentLang: 'es',
  }),
}));

const mockFeedbackData = {
  feedbackListAdapter: [
    {
      created_at: '2024-01-01',
      image: '/img.jpg',
      nickname: 'user1',
      ratings_breakdown: [
        { name: 'Price', value: '4' },
        { name: 'Value', value: '5' },
        { name: 'Quality', value: '3' },
      ],
      name: 'Product A',
      sku: 'SKU-001',
      status: 'APPROVED',
      text: 'Great!',
      summary: 'Good summary',
    },
  ],
};

const createWrapper = () => {
  const qc = new QueryClient();
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useFeedbackList', () => {
  beforeEach(() => {
    (useGetFeedback as jest.Mock).mockReturnValue({
      reviews: mockFeedbackData,
      isError: false,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns reviewsList with formatted items', () => {
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    expect(result.current.reviewsList).toHaveLength(1);
    expect(result.current.reviewsList[0]).toMatchObject({
      sku: 'SKU-001',
      price: '4',
      value: '5',
      quality: '3',
    });
  });

  it('returns N/A when rating not found in breakdown', () => {
    (useGetFeedback as jest.Mock).mockReturnValue({
      reviews: {
        feedbackListAdapter: [
          {
            ...mockFeedbackData.feedbackListAdapter[0],
            ratings_breakdown: [],
          },
        ],
      },
      isError: false,
      isLoading: false,
    });
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    expect(result.current.reviewsList[0]).toMatchObject({
      price: 'N/A',
      value: 'N/A',
      quality: 'N/A',
    });
  });

  it('returns tableHead with expected columns', () => {
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    expect(result.current.tableHead).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'sku' }),
      ])
    );
  });

  it('returns isLoading and isError from underlying hook', () => {
    (useGetFeedback as jest.Mock).mockReturnValue({
      reviews: { feedbackListAdapter: [] },
      isError: true,
      isLoading: false,
    });
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    expect(result.current).toMatchObject({
      isError: true,
      isLoading: false,
    });
  });
});
