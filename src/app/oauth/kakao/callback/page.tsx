'use client'

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect} from "react";
import {axiosInstance} from "@/util";
import {useUserStore} from "@/store";

export default function CallbackKakaoOauthPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const { setUser } = useUserStore();

  useEffect(() => {
    (async () => {
      if (!code) {
        router.back();
        return;
      }

      const response = await axiosInstance.post('/auth/login', { kakaoCode: code });

      if (response.data.content.error) return;

      localStorage.setItem('token', response.data.content.token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.content.token}`;

      const response2 = await axiosInstance.get('/auth/me');
      setUser(response2.data.content.user);

      router.push('/');
    })();
  }, [])

  return null;
}