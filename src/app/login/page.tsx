'use client';

import { useRouter } from "next/navigation";

import { RiKakaoTalkFill } from "react-icons/ri";

const KAKAO_REST_API_KEY = '4764b4de54c975f5ef2af1fa835b2458';
const KAKAO_REDIRECT_URI = 'https://moodiary.p-e.kr/oauth/kakao/callback';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push(`https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`);
  }

  return (
    <div className="flex flex-col h-full gap-72 items-center justify-center">
      <h1 className="text-7xl font-[italianno]">Moodiary</h1>

      <button className="flex flex-row items-center gap-2 bg-kakao-background text-kakao-text px-16 py-3 rounded-xl" onClick={handleLogin}>
        <RiKakaoTalkFill className="text-kakao-text" size={24} />
        카카오로 로그인
      </button>
    </div>
  );
}