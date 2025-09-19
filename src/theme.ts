import { createTheme } from '@mui/material/styles';

const customPrimary = '#1976d2';
const customSecondary = '#9c27b0';
const customSurface = '#ffffff';
const customSurfaceVariant = '#e0e3e7';
const customOutline = '#c2c5c9';

const MOBILE_SPACE = '16px';
const DESKTOP_SPACE = '32px';

export const customThemeVars = {
  body: {
    margin: { mobile: MOBILE_SPACE, desktop: DESKTOP_SPACE },
    padding: { mobile: MOBILE_SPACE, desktop: DESKTOP_SPACE },
    innerMargin: { mobile: MOBILE_SPACE, desktop: DESKTOP_SPACE },
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: customPrimary },
    secondary: { main: customSecondary },
    background: { default: '#f5f5f5', paper: customSurface },
    divider: customOutline,
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: 'var(--font-roboto), Roboto, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: 0.2,
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 28,
          border: `1px solid ${customSurfaceVariant}`,
          background: customSurface,
          boxShadow: theme.shadows[8],
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: customThemeVars.body.padding.mobile,
          [theme.breakpoints.up('sm')]: {
            padding: customThemeVars.body.padding.desktop,
          },
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: customThemeVars.body.innerMargin.mobile,
          [theme.breakpoints.up('sm')]: {
            padding: customThemeVars.body.innerMargin.desktop,
          },
        }),
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: customThemeVars.body.padding.mobile,
          [theme.breakpoints.up('sm')]: {
            padding: customThemeVars.body.padding.desktop,
          },
        }),
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: 6,
          borderRadius: 6,
          backgroundColor: theme.palette.action.hover,
          overflow: 'hidden',
        }),
        bar: {
          borderRadius: 6,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: () => ({
          '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 25,
          border: `1px solid ${customSurfaceVariant}`,
          background: customSurface,
          boxShadow: theme.shadows[3],
          height: '100%',
          padding: customThemeVars.body.padding.mobile,
          [theme.breakpoints.up('sm')]: {
            padding: customThemeVars.body.padding.desktop,
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: 20,
          paddingInline: theme.spacing(2.5),
          paddingBlock: theme.spacing(1.1),
          fontWeight: 600,
          ...(ownerState.variant === 'contained' && {
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }),
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: customSurface,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${customOutline}`,
          boxShadow: 'none',
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 56,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: () => ({
          backgroundImage: 'none',
        }),
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: () => ({
          fontWeight: 600,
        }),
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: () => ({
          '&.Mui-active': { color: customPrimary },
          '&.Mui-completed': { color: '#34a853' },
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 18,
          alignItems: 'center',
          padding: theme.spacing(1.25, 2),
          fontSize: theme.typography.body2.fontSize,
          boxShadow: theme.shadows[2],
        }),
        filledWarning: () => ({
          background: '#fcefd5',
          color: '#6b4b00',
        }),
        filledSuccess: () => ({
          background: '#dff5e6',
          color: '#0b4d2b',
        }),
        filledError: () => ({
          background: '#fde4e4',
          color: '#6b2020',
        }),
        message: { padding: 0 },
        action: { marginRight: 4 },
      }
    },
  },
});

export default theme;
