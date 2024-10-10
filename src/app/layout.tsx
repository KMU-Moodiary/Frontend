'use client';

import React, {useEffect} from "react";
import {Bounce, ToastContainer} from "react-toastify";

import { useRouter } from "next/navigation";

import {useUserStore} from "@/store";

import {axiosInstance} from "@/util";

import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();

  const { setUser } = useUserStore();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.replace('/login')
        return;
      }

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axiosInstance.get('/auth/me');

      if (response.data.content.error) {
        localStorage.removeItem('token');
        return;
      }

      setUser(response.data.content.user);
    })();
  }, [])

  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Moodiary</title>
      </head>
      <body className="h-screen bg-gray-100">
        {children}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </body>
    </html>
  );
}
