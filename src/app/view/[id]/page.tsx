'use client';

import {useRouter} from "next/navigation";

import React, { useEffect, useState } from "react"
import {FaAngleLeft, FaComment, FaEdit, FaTrash} from "react-icons/fa";

import {Modal} from "@/components";

import {axiosInstance} from "@/util";

export default function ViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [content, setContent] = useState("")
  const [feedback, setFeetback] = useState("")
  const [createdAt, setCreatedAt] = useState(new Date());
  const [modalOpen, setModalOpen] = useState<string | null>(null)

  useEffect(() => {
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
      setFeetback(response.data.content.diary.feedback);
      setCreatedAt(new Date(response.data.content.diary.createdAt));
    })();
  }, []);

  const formattedDate = `${createdAt.getFullYear()}년 ${String(createdAt.getMonth() + 1).padStart(2, '0')}월 ${String(createdAt.getDate()).padStart(2, '0')}일 일기`

  return (
    <>
      <div className="p-4 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <FaAngleLeft size={24} onClick={() => router.push('/')}/>
          <div className="flex gap-3">
            <FaComment size={24} onClick={() => setModalOpen('comment')}/>
            <FaEdit size={24} onClick={() => router.push(`/write/${params.id}`)}/>
            <FaTrash size={24} onClick={() => setModalOpen('trash')}/>
          </div>
        </div>
        <h1 className="mb-4 font-pen text-3xl">{formattedDate}</h1>
        <div className="flex-grow overflow-y-auto">
          <p className="w-full font-pen text-lg">
            {content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>

        </div>
      </div>

      <Modal
        isOpen={modalOpen === 'comment'}
        onClose={() => setModalOpen(null)}
      >
        <div className="flex flex-col items-center">
          <FaComment size={36} className="text-neutral-700"/>
          <p className="font-pen text-3xl">AI 피드백</p>
          <p className="font-pen text-lg">{feedback}</p>
        </div>
      </Modal>

      <Modal
        isOpen={modalOpen === 'trash'}
        onClose={() => setModalOpen(null)}
      >
        <div className="flex flex-col items-center">
          <FaTrash size={36} className="text-neutral-700"/>
          <p className="font-pen text-3xl">정말로 삭제하시겠습니까?</p>
          <div className="flex gap-4 mt-4">
            <button className="bg-red-500 font-pen text-white px-4 py-1.5 rounded" onClick={async () => {
              await axiosInstance.delete(`/diary/${params.id}`);
              router.push('/');
            }}>삭제</button>
            <button className="bg-gray-200 text-gray-800 font-pen px-4 py-1.5 rounded" onClick={() => setModalOpen(null)}>취소</button>
          </div>
        </div>
      </Modal>
    </>
  )
}