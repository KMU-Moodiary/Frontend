'use client';

import React, {useEffect, useState} from 'react'
import {FaPencilAlt, FaAngleLeft, FaAngleRight} from "react-icons/fa";
import {useUserStore} from "@/store";
import {useRouter} from "next/navigation";
import {axiosInstance} from "@/util";

interface Diary {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: object;
  emotion: 'HAPPY' | 'SAD' | 'ANGRY' | 'SURPRISED' | 'NEUTRAL';
  content: string;
  feedback: string;
}

const moodColors = {
  HAPPY: 'bg-green-400',
  SAD: 'bg-blue-400',
  ANGRY: 'bg-red-400',
  SURPRISED: 'bg-yellow-400',
  NEUTRAL: 'bg-gray-400'
}

export default function MainPage() {
  const router = useRouter()

  const { nickname } = useUserStore();

  const [diaries, setDiaries] = useState<Diary[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');

      if (token) {
        const response = await axiosInstance.get('/diary', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.content.error) return;

        setDiaries(response.data.content.diaries)
      }
    })();
  }, [])

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    if (currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() >= new Date().getMonth()) {
      return
    }

    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    const totalCells = 42;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDay + 1
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const entry = diaries.find((diary) => new Date(diary.createdAt).toDateString() === new Date(date).toDateString())

      if (i < firstDay || day > daysInMonth) {
        days.push(<div key={`empty-${i}`} className="w-10 h-10" />)
      } else {
        days.push(
          <div key={day} className="w-10 h-10 flex items-center justify-center relative" onClick={() => {
            if (entry) {
              router.push(`/view/${entry.id}`)
            }
          }}>
            <div
              className={`w-full h-full flex items-center justify-center ${entry && moodColors[entry.emotion]} rounded-full text-center font-pen text-xl`}>
              {day}
            </div>
          </div>
        )
      }
    }

    return days
  }

  return (
    <div className="h-full flex flex-col justify-center relative p-4">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-3xl mb-4 text-center font-pen">{nickname}님, 오늘을 기록하세요</h1>
        <div className="mb-4 flex justify-between items-center">
          <button onClick={goToPreviousMonth} className="p-2">
            <FaAngleLeft size={24} />
          </button>
          <span className="text-2xl font-pen">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </span>
          <button onClick={goToNextMonth} className="p-2">
            <FaAngleRight size={24} className={currentDate.getFullYear() === new Date().getFullYear() && currentDate.getMonth() >= new Date().getMonth() ? 'text-neutral-400' : ''} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="w-10 text-center font-pen text-xl">
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
      </div>
      {diaries.find((diary) => new Date(diary.createdAt).toDateString() !== new Date().toDateString()) && (
        <button className="absolute bottom-6 right-6 rounded-full p-3 shadow-lg bg-black text-white">
          <FaPencilAlt size={24} onClick={() => router.push('/write')} />
        </button>
      )}
    </div>
  )
}