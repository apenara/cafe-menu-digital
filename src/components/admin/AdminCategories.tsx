'use client';

import { useState } from 'react';
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
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Category } from '@/types/menu';

interface AdminCategoriesProps {
  initialCategories: Category[];
}

export default function AdminCategories({ initialCategories }: AdminCategoriesProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [nameEs, setNameEs] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionEs, setDescriptionEs] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [order, setOrder] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations();
  const toast = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    const imageRef = ref(storage, `categories/${Date.now()}_${file.name}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = currentCategory?.image || '';
      
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const categoryData = {
        name: {
          es: nameEs,
          en: nameEn,
        },
        description: {
          es: descriptionEs,
          en: descriptionEn,
        },
        image: imageUrl,
        order: parseInt(order),
      };

      if (currentCategory) {
        // Actualizar categoría existente
        await updateDoc(doc(db, 'categories', currentCategory.id), categoryData);
        setCategories(categories.map(cat => 
          cat.id === currentCategory.id ? { ...categoryData, id: currentCategory.id } : cat
        ));
      } else {
        // Crear nueva categoría
        const docRef = await addDoc(collection(db, 'categories'), categoryData);
        setCategories([...categories, { ...categoryData, id: docRef.id }]);
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

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setNameEs(category.name.es);
    setNameEn(category.name.en);
    setDescriptionEs(category.description?.es || '');
    setDescriptionEn(category.description?.en || '');
    setOrder(category.order.toString());
    onOpen();
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(t('common.confirm'))) {
      try {
        await deleteDoc(doc(db, 'categories', category.id));
        if (category.image) {
          const imageRef = ref(storage, category.image);
          await deleteObject(imageRef);
        }
        setCategories(categories.filter(cat => cat.id !== category.id));
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
    setCurrentCategory(null);
    setNameEs('');
    setNameEn('');
    setDescriptionEs('');
    setDescriptionEn('');
    setImage(null);
    setOrder('');
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
        {t('admin.categories.add')}
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t('admin.categories.name')} (ES)</Th>
            <Th>{t('admin.categories.name')} (EN)</Th>
            <Th>{t('admin.categories.order')}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr key={category.id}>
              <Td>{category.name.es}</Td>
              <Td>{category.name.en}</Td>
              <Td>{category.order}</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label={t('common.edit')}
                    icon={<EditIcon />}
                    onClick={() => handleEdit(category)}
                    colorScheme="blue"
                    size="sm"
                  />
                  <IconButton
                    aria-label={t('common.delete')}
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(category)}
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
            {currentCategory
              ? t('admin.categories.edit')
              : t('admin.categories.add')}
          </ModalHeader>
          <ModalBody>
            <form id="category-form" onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{t('admin.categories.name')} (ES)</FormLabel>
                  <Input
                    value={nameEs}
                    onChange={(e) => setNameEs(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('admin.categories.name')} (EN)</FormLabel>
                  <Input
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('admin.categories.description')} (ES)</FormLabel>
                  <Input
                    value={descriptionEs}
                    onChange={(e) => setDescriptionEs(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('admin.categories.description')} (EN)</FormLabel>
                  <Input
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('admin.categories.image')}</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('admin.categories.order')}</FormLabel>
                  <Input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
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
              form="category-form"
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