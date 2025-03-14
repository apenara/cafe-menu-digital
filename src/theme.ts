import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#f5f0e5',
      100: '#e6d5b8',
      200: '#d5b98a',
      300: '#c49d5c',
      400: '#b3822e',
      500: '#996b15',
      600: '#785410',
      700: '#573d0b',
      800: '#362606',
      900: '#150f01',
    },
  },
  fonts: {
    heading: 'var(--font-playfair)',
    body: 'var(--font-inter)',
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'lg',
        },
      },
    },
  },
});

export default theme;