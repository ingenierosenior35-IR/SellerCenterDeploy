import type { SxProps } from '@mui/material/styles';
import type { CardProps } from '@mui/material/Card';

import { orderBy } from 'es-toolkit';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: ItemProps[];
};

export function AppTopProducts({ title, subheader, list, sx, ...other }: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {orderBy(list, ['totalFavorites'], ['desc']).map((item, index) => (
          <Item key={item.id} item={item} index={index} />
        ))}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly totalFavorites: number;
};

function Item({ 
  item, 
  index, 
  sx, 
  ...other 
}: { 
  readonly item: ItemProps; 
  readonly index: number;
  readonly sx?: SxProps 
}) {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Avatar
        src={item.image}
        variant="rounded"
        sx={{ width: 48, height: 48, mr: 2 }}
      />

      <Box sx={{ minWidth: 0 }}>
        <Box
          sx={{
            typography: 'subtitle2',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </Box>

        <Box
          sx={{
            typography: 'caption',
            color: 'text.secondary',
          }}
        >
          {item.totalFavorites}: ventas
        </Box>
      </Box>
    </Box>
  );
}
