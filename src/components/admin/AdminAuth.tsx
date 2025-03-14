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
  Container,
  Heading,
} from '@chakra-ui/react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
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

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center">{t('common.loading')}</Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxW="container.sm" py={8}>
        <VStack spacing={8}>
          <Heading as="h1" size="xl">
            {t('admin.login')}
          </Heading>
          <Box as="form" onSubmit={handleLogin} width="100%">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t('admin.email')}</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('admin.password')}</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="brand" width="100%">
                {t('admin.login')}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    );
  }

  return (
    <>
      <Box
        position="fixed"
        top={4}
        right={4}
        zIndex={10}
      >
        <Button onClick={handleLogout} colorScheme="red" size="sm">
          {t('admin.logout')}
        </Button>
      </Box>
      {children}
    </>
  );
}