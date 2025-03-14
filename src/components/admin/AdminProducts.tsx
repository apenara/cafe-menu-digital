'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  HStack,
  Select,
  Switch,
  TagInput,
  Tag,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Category, Product } from '@/types/menu';

interface AdminProductsProps {
  categories: Category[];
}

export default function AdminProducts({ categories }: AdminProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [nameEs, setNameEs] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionEs, setDescriptionEs] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [order, setOrder] = useState('');
  const [available, setAvailable] = useState(true);
  const [ingredientsEs, setIngredientsEs] = useState<string[]>([]);
  const [ingredientsEn, setIngredientsEn] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations();
  const toast = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    const productsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    setProducts(productsData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = currentProduct?.image || '';
      
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const productData = {
        name: {
          es: nameEs,
          en: nameEn,
        },
        description: {
          es: descriptionEs,
          en: descriptionEn,
        },
        price: parseFloat(price),
        categoryId,
        image: imageUrl,
        order: parseInt(order),
        available,
        ingredients: {
          es: ingredientsEs,
          en: ingredientsEn,
        },
        allergens,
      };

      if (currentProduct) {
        // Actualizar producto existente
        await updateDoc(doc(db, 'products', currentProduct.id), productData);
        setProducts(products.map(prod => 
          prod.id === currentProduct.id ? { ...productData, id: currentProduct.id } : prod
        ));
      } else {
        // Crear nuevo producto
        const docRef = await addDoc(collection(db, 'products'), productData);
        setProducts([...products, { ...productData, id: docRef.id }]);
      }

      resetForm();
      onClose();
      toast({
        title: t('common.success'),
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setNameEs(product.name.es);
    setNameEn(product.name.en);
    setDescriptionEs(product.description?.es || '');
    setDescriptionEn(product.description?.en || '');
    setPrice(product.price.toString());
    setCategoryId(product.categoryId);
    setOrder(product.order.toString());
    setAvailable(product.available);
    setIngredientsEs(product.ingredients?.es || []);
    setIngredientsEn(product.ingredients?.en || []);
    setAllergens(product.allergens || []);
    onOpen();
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(t('common.confirm'))) {
      try {
        await deleteDoc(doc(db, 'products', product.id));
        if (product.image) {
          const imageRef = ref(storage, product.image);
          await deleteObject(imageRef);
        }
        setProducts(products.filter(prod => prod.id !== product.id));
        toast({
          title: t('common.success'),
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: t('common.error'),
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const resetForm = () => {
    setCurrentProduct(null);
    setNameEs('');
    setNameEn('');
    setDescriptionEs('');
    setDescriptionEn('');
    setPrice('');
    setCategoryId('');
    setImage(null);
    setOrder('');
    setAvailable(true);
    setIngredientsEs([]);
    setIngredientsEn([]);
    setAllergens([]);
  };

  const handleAddNew = () => {
    resetForm();
    onOpen();
  };

  return (
    <Box>
      <Button
        onClick={handleAddNew}
        colorScheme="brand"
        mb={6}
      >
        {t('admin.products.add')}
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t('admin.products.name')} (ES)</Th>
            <Th>{t('admin.products.category')}</Th>
            <Th>{t('admin.products.price')}</Th>
            <Th>{t('admin.products.available')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.id}>
              <Td>{product.name.es}</Td>
              <Td>
                {categories.find(cat => cat.id === product.categoryId)?.name.es}
              </Td>
              <Td>${product.price.toFixed(2)}</Td>
              <Td>
                <Switch
                  isChecked={product.available}
                  isReadOnly
                  colorScheme="green"
                />
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label={t('common.edit')}
                    icon={<EditIcon />}
                    onClick={() => handleEdit(product)}
                    colorScheme="blue"
                    size="sm"
                  />
                  <IconButton
                    aria-label={t('common.delete')}
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(product)}
                    colorScheme="red"
                    size="sm"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentProduct
              ? t('admin.products.edit')
              : t('admin.products.add')}
          </ModalHeader>
          <ModalBody>
            <form id="product-form" onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('admin.products.name')} (ES)</FormLabel>
                  <Input
                    value={nameEs}
                    onChange={(e) => setNameEs(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('admin.products.name')} (EN)</FormLabel>
                  <Input
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('admin.products.description')} (ES)</FormLabel>
                  <Input
                    value={descriptionEs}
                    onChange={(e) => setDescriptionEs(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('admin.products.description')} (EN)</FormLabel>
                  <Input
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('admin.products.price')}</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('admin.products.category')}</FormLabel>
                  <Select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">{t('common.select')}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name.es}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>{t('admin.products.image')}</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('admin.products.order')}</FormLabel>
                  <Input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    {t('admin.products.available')}
                  </FormLabel>
                  <Switch
                    isChecked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    colorScheme="green"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('menu.ingredients')} (ES)</FormLabel>
                  <TagInput
                    value={ingredientsEs}
                    onChange={setIngredientsEs}
                    placeholder={t('admin.products.add_ingredient')}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('menu.ingredients')} (EN)</FormLabel>
                  <TagInput
                    value={ingredientsEn}
                    onChange={setIngredientsEn}
                    placeholder={t('admin.products.add_ingredient')}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('menu.allergens')}</FormLabel>
                  <TagInput
                    value={allergens}
                    onChange={setAllergens}
                    placeholder={t('admin.products.add_allergen')}
                  />
                </FormControl>
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              form="product-form"
              colorScheme="brand"
            >
              {t('common.save')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}