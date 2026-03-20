'use client';

import { useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
// import { DashboardContent } from 'src/layouts/dashboard/content';
import { paths } from 'src/routes/paths';
import { useFeedbackList } from 'src/hooks/feedback/use-feedback-list';
import { CommonTable } from '../components/common-table';
import { FeedbackTableFormated } from 'src/interfaces/feedback/feedback-list';
import { HomeContent } from 'src/layouts/home';
import { useTranslate } from 'src/locales';

export default function FeedbackView() {
  const { reviewsList, tableHead, handleFilterClick } = useFeedbackList();
  const { translate } = useTranslate();

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedRating, setSelectedRating] = useState('4');

  const handleOpenFilterPopup = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilterPopup = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = () => {
    handleFilterClick(selectedRating);
    handleCloseFilterPopup();
  };



  const sellRender = (review: FeedbackTableFormated, index: number) => {
    return (
      <TableRow key={index}>
        <TableCell align="left">{review.sku}</TableCell>
        <TableCell align="left">
          <Avatar src={review.image} variant="rounded" />
        </TableCell>
        <TableCell align="left">{review.name}</TableCell>
        <TableCell align="left">
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {Array.from({ length: Number(review.price) }).map((_, index) => (
              <img
                key={index}
                src="/assets/icons/common/ic-star.svg"
                alt="star"
                width={16}
                height={16}
                style={{ display: 'block' }}
              />
            ))}
          </Box>
        </TableCell>
        <TableCell align="left">
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {Array.from({ length: Number(review.price) }).map((_, index) => (
              <img
                key={index}
                src="/assets/icons/common/ic-star.svg"
                alt="star"
                width={16}
                height={16}
                style={{ display: 'block' }}
              />
            ))}
          </Box>
        </TableCell>
        <TableCell align="left">
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {Array.from({ length: Number(review.quality) }).map((_, index) => (
              <img
                key={index}
                src="/assets/icons/common/ic-star.svg"
                alt="star"
                width={16}
                height={16}
                style={{ display: 'block' }}
              />
            ))}
          </Box>
        </TableCell>
        <TableCell align="left">{review.text}</TableCell>
        <TableCell align="left">{review.sumary}</TableCell>
        <TableCell align="left">{review.nickname}</TableCell>
        <TableCell align="left">{review.status ?? 'N/A'}</TableCell>
        <TableCell align="left">{review.created_at}</TableCell>
      </TableRow>
    );
  };
  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('feedbackModule.title')}
        links={[{ name: 'Home', href: paths.home.root }, { name: translate('feedbackModule.title') }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* <CustomTable /> */}
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={reviewsList}
        renderCell={sellRender}
        filterKeys={['nickname']}
        filterTemplate={
          <Button
            variant="outlined"
            onClick={handleOpenFilterPopup}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: '50%',
              p: 0,
            }}
          >
            <Iconify icon="ic:round-filter-list" width={20} />
          </Button>
        }
        searchPlaceholder={`${translate('feedbackModule.table.searchFilter')}`}
      />

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleCloseFilterPopup}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, minWidth: 240 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {translate('feedbackModule.table.popup.title')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {translate('feedbackModule.table.popup.filterByRating.title')}
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="rating-filter-label">Rating</InputLabel>
            <Select
              labelId="rating-filter-label"
              value={selectedRating}
              label={translate('feedbackModule.table.popup.filterByRating.label')}
              onChange={(event) => setSelectedRating(event.target.value)}
            >
              <MenuItem value="1">{translate('feedbackModule.table.popup.filterByRating.options.1')}</MenuItem>
              <MenuItem value="2">{translate('feedbackModule.table.popup.filterByRating.options.2')}</MenuItem>
              <MenuItem value="3">{translate('feedbackModule.table.popup.filterByRating.options.3')}</MenuItem>
              <MenuItem value="4">{translate('feedbackModule.table.popup.filterByRating.options.4')}</MenuItem>
              <MenuItem value="5">{translate('feedbackModule.table.popup.filterByRating.options.5')}</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={handleCloseFilterPopup}>
              Cancel
            </Button>
            <Button size="small" variant="contained" onClick={handleApplyFilter}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </HomeContent>
  );
}
