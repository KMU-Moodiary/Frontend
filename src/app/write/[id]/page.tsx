'use client';

import {useRouter} from "next/navigation";

import React, { useRef, useEffect, useState } from "react"
import {FaSave, FaAngleLeft, FaComment} from "react-icons/fa";
import {TypeAnimation} from "react-type-animation";

import {Modal} from "@/components";

import {axiosInstance} from "@/util";

export default function DiaryPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [content, setContent] = useState("")
  const [diaryId, setDiaryId] = useState("")
  const [feedback, setFeedback] = useState("")
  const [date, setDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const formattedDate = `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일 일기`

  useEffect(() => {
    if (params.id === 'new') return;

    (async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axiosInstance.get(`/diary/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.content.error) return;

      setContent(response.data.content.diary.content);
      setDiaryId(response.data.content.diary.id);
      setFeedback(response.data.content.diary.feedback);
      setDate(new Date(response.data.content.diary.createdAt));
    })();
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [content])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleSave = async () => {
    setIsModalOpen(true);
    setFeedback('생각을 정리하고 있어요...');

    let response;

    if (params.id === 'new') {
      response = await axiosInstance.post('/diary/create', { content });
    } else {
      response = await axiosInstance.patch(`/diary/${params.id}`, { content });
    }

    if (response.data.content.error) return;

    setDiaryId(response.data.content.diary.id);
    setFeedback(response.data.content.diary.feedback);
  }

  return (
    <>
      <div className="p-4 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <FaAngleLeft size={24} onClick={() => router.push('/')}/>
          <FaSave size={24} onClick={handleSave}/>
        </div>
        <h1 className="text-3xl font-pen mb-4">{formattedDate}</h1>
        <div className="flex-grow overflow-y-auto">
        <textarea
          ref={textareaRef}
          className="w-full h-full bg-transparent focus:outline-none font-pen text-lg"
          placeholder="오늘의 일기를 작성해주세요..."
          value={content}
          onChange={handleTextareaChange}
        />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => router.push(`/view/${diaryId}`)}
      >
        <div className="flex flex-col items-center">
          <FaComment size={36} className="text-neutral-700" />
          <p className="font-pen text-3xl">AI 피드백</p>
          {feedback === '생각을 정리하고 있어요...'
            ? <div className="inline-block mt-8 h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-e-transparent" />
            : <TypeAnimation sequence={[feedback]} speed={2} repeat={0} className="font-pen text-lg" />}
        </div>
      </Modal>
    </>
  )
}