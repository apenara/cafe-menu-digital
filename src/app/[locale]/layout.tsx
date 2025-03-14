import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from '@/theme';
 
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}
 
export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}