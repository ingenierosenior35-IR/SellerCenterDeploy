import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------
// Footer compartido por todos los pasos del wizard:
//  · botón submit (label configurable)
//  · "Ya tengo una cuenta · Iniciar Sesión"
// ----------------------------------------------------------------------

type Props = {
  loading?: boolean;
  disabled?: boolean;
  /** key i18n para el label del submit. Default: createSellers.common.continue */
  submitLabelKey?: string;
};

export function WizardFooter({
  loading,
  disabled,
  submitLabelKey = 'createSellers.common.continue',
}: Props) {
  const { translate } = useTranslate();

  return (
    <>
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={loading}
        disabled={disabled}
        sx={{ mt: 1, borderRadius: 999 }}
      >
        {translate(submitLabelKey)}
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          {translate('createSellers.common.alreadyHaveAccount')}
        </Typography>
        <Link
          component={RouterLink}
          to={paths.auth.signIn}
          variant="subtitle2"
          sx={{ color: 'common.white' }}
        >
          {translate('createSellers.common.signIn')}
        </Link>
      </Box>
    </>
  );
}
