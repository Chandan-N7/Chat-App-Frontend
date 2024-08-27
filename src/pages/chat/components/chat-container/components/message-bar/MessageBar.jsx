import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from '@/store/store';
import { useSocket } from '@/context/SocketContext';
import apiClint from '@/lib/api-clint';
import { UPLOAD_FILE_ROUTE } from '@/utils/constants';


const MessageBar = () => {
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    directMessagesContacts,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore()
  const socket = useSocket()
  const emojiRef = useRef()
  const fileInputRef = useRef()
  const [message, setMessage] = useState("")
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    };
  }, [])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
      setMessage("")

    }
    console.log(directMessagesContacts)
  }

  const handleAttchmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  const handleAttchmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file)
        setIsUploading(true)
        const response = await apiClint.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: data => {
            setFileUploadProgress(Math.round((100*data.loaded)/data.total))
          }
        })
        console.log(response.data.filePath)


        if (response.status === 200 && response.data) {
          setIsUploading(false)
          if (selectedChatType === "contact") {
            console.log(response.data.filePath)

            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            })

          }
        }
      }
    } catch (error) {
      setIsUploading(false)
      console.log({error});

    }
  }
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center justify-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2d33] rounded-md items-center gap-5 pr-5">
        <input type="text" className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder='Enter Message'
          value={message}
          onChange={e => setMessage(e.target.value)} />
        <button className="text-neutral-500 focus:border-none focus:text-white duration-300 transition-all focus:outline-none"
          onClick={handleAttchmentClick}
        >
          <GrAttachment className="text-2xl" />

        </button>
        <input type="file" className='hidden' ref={fileInputRef} onChange={(event) => handleAttchmentChange(event)} />
        <div className="relative">
          <button className="text-neutral-500 focus:border-none focus:text-white duration-300 transition-all focus:outline-none"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
        </div>
        <div className="absolute bottom-16 right-0" ref={emojiRef}>
          <EmojiPicker theme="dark" open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch="false" />
        </div>
      </div>
      <button className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:text-white duration-300 transition-all focus:outline-none"
        onClick={handleSendMessage}>
        <IoSend className="text-2xl" />
      </button>
    </div>
  )
}

export default MessageBar