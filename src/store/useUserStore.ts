import { create } from 'zustand';

interface User {
  id: string;
  kakaoId: number;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
  setUser: (user: User) => void;
}

export const useUserStore = create<User>((set) => ({
  id: '',
  kakaoId: 0,
  nickname: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  setUser: (user: User) => set(() => ({
    id: user.id,
    kakaoId: user.kakaoId,
    nickname: user.nickname,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  })),
}))