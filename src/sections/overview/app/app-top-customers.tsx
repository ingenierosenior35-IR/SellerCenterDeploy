import type { SxProps } from '@mui/material/styles';
import type { CardProps } from '@mui/material/Card';

import { orderBy } from 'es-toolkit';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: React.ReactNode;
  subheader?: string;
  list: ItemCustomerProps[];
};

export function AppTopCustomers({ title, subheader, list, sx, ...other }: Props) {
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
        {orderBy(list, ['name'], ['desc']).map((item, index) => (
          <Item key={item.id} item={item} index={index} />
        ))}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemCustomerProps = {
    readonly id: string;
    readonly name: string;
    readonly email: string;    
};

function Item({ 
    item, 
    index, 
    sx, 
    ...other 
}: { 
    readonly item: ItemCustomerProps; 
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
            {item.email}
          </Box>
        </Box>
      </Box>
    );
  }
