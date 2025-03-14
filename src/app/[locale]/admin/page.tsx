import { useTranslations } from 'next-intl';
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminAuth from '@/components/admin/AdminAuth';
import { getCategories } from '@/lib/menu';

export default async function AdminPage() {
  const t = useTranslations();
  const categories = await getCategories();

  return (
    <AdminAuth>
      <Box as="main" py={8}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Heading as="h1" size="2xl" color="brand.600">
              {t('admin.dashboard')}
            </Heading>

            <Tabs colorScheme="brand" isLazy>
              <TabList>
                <Tab>{t('admin.categories.title')}</Tab>
                <Tab>{t('admin.products.title')}</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <AdminCategories initialCategories={categories} />
                </TabPanel>
                <TabPanel>
                  <AdminProducts categories={categories} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Container>
      </Box>
    </AdminAuth>
  );
}