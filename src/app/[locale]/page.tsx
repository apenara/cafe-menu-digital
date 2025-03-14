import { useTranslations } from 'next-intl';
import { Box, Container, Heading, SimpleGrid, VStack } from '@chakra-ui/react';
import CategoryCard from '@/components/CategoryCard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getCategories } from '@/lib/menu';

export default async function HomePage() {
  const t = useTranslations();
  const categories = await getCategories();

  return (
    <Box as="main" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="2xl" color="brand.600">
              {t('menu.title')}
            </Heading>
            <LanguageSwitcher />
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}