import { useRouter, useParams } from 'next/navigation';
import { Box, Image, Heading, Text, Card, CardBody } from '@chakra-ui/react';
import { Category } from '@/types/menu';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <Card
      onClick={() => router.push(`/${locale}/category/${category.id}`)}
      cursor="pointer"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)' }}
    >
      <CardBody>
        <Box position="relative" height="200px" mb={4}>
          <Image
            src={category.image || '/images/default-category.jpg'}
            alt={category.name[locale]}
            fill
            style={{ objectFit: 'cover' }}
            borderRadius="md"
          />
        </Box>
        <Heading size="md" mb={2}>
          {category.name[locale]}
        </Heading>
        {category.description && (
          <Text color="gray.600">
            {category.description[locale]}
          </Text>
        )}
      </CardBody>
    </Card>
  );
}