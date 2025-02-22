import apiClint from '@/lib/api-clint'
import { useAppStore } from '@/store/store'
import { GET_ALL_MESSAGES_ROUTES, HOST } from '@/utils/constants'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from 'react-icons/io5'



const MessageContainer = () => {
  const scrollReff = useRef()
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore()
  const [showImage, setShowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClint.post(GET_ALL_MESSAGES_ROUTES, { id: selectedChatData._id }, { withCredentials: true });

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);

        }

      } catch (error) {
        console.log("error", error)
      }
    }
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages])

  useEffect(() => {
    if (scrollReff.current) {
      scrollReff.current.scrollIntoView({ behavior: "smooth", block: 'end' })
    }
  }, [selectedChatMessages])

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpge|png|bmp|gif|tiff|tif|webp|svg|ico|heic|heif)$/i
    return imageRegex.test(filePath)
  }

  const renderMessages = () => {
    let lastDate = null
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD")
      const showDate = messageDate !== lastDate
      lastDate = messageDate
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          <div>
            {selectedChatType === "contact" && renderMessage(message)}
          </div>
        </div>
      )
    })
  }

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClint.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (ProgressEvent) => {
        const { loaded, total } = ProgressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setFileDownloadProgress(percentCompleted)
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = urlBlob
    link.setAttribute("download", url.split("/").pop())
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false)
    setFileDownloadProgress(0)

  }

  const renderMessage = (message) => (
    <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
      {message.messageType === "text" && (
        <div className={`${message.sender !== selectedChatData._id ?
          "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
          "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
          {message.content}
        </div>
      )}
      {
        message.messageType === "file" && (
          <div className={`${message.sender !== selectedChatData._id ?
            "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
            "bg-[#2a2b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>

            {checkIfImage(message.fileUrl) ?
              <div className="cursor-pointer" onClick={() => { setShowImage(true); setImageUrl(message.fileUrl) }}>
                <img src={`${HOST}/${message.fileUrl}`} alt="" height={300} width={300} />
              </div>
              : <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 right-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split('/').pop()}</span>
                <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />

                </span>
              </div>}

          </div>
        )
      }
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollReff} />
      <div>
        {
          showImage && [
            <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col ">
              <div>
                <img src={`${HOST}/${imageUrl}`} alt="" className="h-[80vh] w-full bg-cover" />
              </div>
              <div className="flex gap-5 fixed top-0 mt-5">
                <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(imageUrl)}>
                  <IoMdArrowRoundDown />
                </button>

                <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => {
                    setShowImage(false)
                    setImageUrl(null)
                  }}>
                  <IoCloseSharp />
                </button>
              </div>
            </div>
          ]
        }
      </div>
    </div>
  )
}

export default MessageContainer
