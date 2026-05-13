'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** /accounts now redirects to /subscription */
export default function AccountsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/subscription'); }, [router]);
  return null;
}
