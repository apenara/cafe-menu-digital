import { useTranslations } from 'next-intl';
import { Box, Container, Heading, SimpleGrid, VStack, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getCategory, getProducts } from '@/lib/menu';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const t = useTranslations();
  const category = await getCategory(params.id);
  
  if (!category) {
    notFound();
  }

  const products = await getProducts(params.id);

  return (
    <Box as="main" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box>
            <Link href={`/${params.locale}`} passHref>
              <Button leftIcon={<ArrowBackIcon />} variant="ghost" mb={4}>
                {t('common.back')}
              </Button>
            </Link>
            <Heading as="h1" size="2xl" color="brand.600">
              {category.name[params.locale]}
            </Heading>
            {category.description && (
              <Box mt={2} color="gray.600">
                {category.description[params.locale]}
              </Box>
            )}
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={params.locale}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}