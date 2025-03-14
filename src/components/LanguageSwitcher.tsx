import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button, ButtonGroup } from '@chakra-ui/react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      <Button
        onClick={() => switchLanguage('es')}
        colorScheme={currentLocale === 'es' ? 'brand' : 'gray'}
      >
        ES
      </Button>
      <Button
        onClick={() => switchLanguage('en')}
        colorScheme={currentLocale === 'en' ? 'brand' : 'gray'}
      >
        EN
      </Button>
    </ButtonGroup>
  );
}