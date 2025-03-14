import { useTranslations } from 'next-intl';
import {
  Box,
  Image,
  Heading,
  Text,
  Card,
  CardBody,
  Badge,
  VStack,
  HStack,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { Product } from '@/types/menu';

interface ProductCardProps {
  product: Product;
  locale: string;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations();

  return (
    <Card>
      <CardBody>
        <Box position="relative" height="200px" mb={4}>
          <Image
            src={product.image || '/images/default-product.jpg'}
            alt={product.name[locale]}
            fill
            style={{ objectFit: 'cover' }}
            borderRadius="md"
          />
        </Box>
        
        <VStack align="stretch" spacing={3}>
          <Box>
            <HStack justify="space-between" align="top" mb={2}>
              <Heading size="md">{product.name[locale]}</Heading>
              <Text fontWeight="bold" color="brand.500">
                ${product.price.toFixed(2)}
              </Text>
            </HStack>
            
            {product.description && (
              <Text color="gray.600" fontSize="sm">
                {product.description[locale]}
              </Text>
            )}
          </Box>

          {product.ingredients && product.ingredients[locale].length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                {t('menu.ingredients')}:
              </Text>
              <HStack spacing={2} flexWrap="wrap">
                {product.ingredients[locale].map((ingredient, index) => (
                  <Tag
                    key={index}
                    size="sm"
                    variant="subtle"
                    colorScheme="gray"
                  >
                    <TagLabel>{ingredient}</TagLabel>
                  </Tag>
                ))}
              </HStack>
            </Box>
          )}

          {product.allergens && product.allergens.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                {t('menu.allergens')}:
              </Text>
              <HStack spacing={2} flexWrap="wrap">
                {product.allergens.map((allergen, index) => (
                  <Tag
                    key={index}
                    size="sm"
                    variant="subtle"
                    colorScheme="red"
                  >
                    <TagLabel>{allergen}</TagLabel>
                  </Tag>
                ))}
              </HStack>
            </Box>
          )}

          <Badge
            colorScheme={product.available ? 'green' : 'red'}
            alignSelf="flex-start"
          >
            {product.available
              ? t('menu.available')
              : t('menu.unavailable')}
          </Badge>
        </VStack>
      </CardBody>
    </Card>
  );
}