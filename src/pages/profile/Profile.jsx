import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/store'
import React, { useEffect, useRef, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from '../../components/ui/avatar';
import { colors, getColor } from '../../lib/utils';
import { FaPlus, FaTrash } from "react-icons/fa"
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import apiClint from '../../lib/api-clint';
import { ADD_PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE, UPDTATE_PROFILE_ROUTE } from '../../utils/constants';
import { HOST } from '../../utils/constants';


const Profile = () => {
  const navigate = useNavigate()
  const { userInfo, setUserInfo } = useAppStore()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef = useRef(null);


  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName)
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
      console.log("ok")
      if (userInfo.image){
        setImage(`${HOST}/${userInfo.image}`)
      console.log(image)}
    }
  }, [userInfo])

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required")
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required")
      return false;
    }
    return true;
  }

  const saveChange = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClint.post(UPDTATE_PROFILE_ROUTE, { firstName, lastName, color: selectedColor }, { withCredentials: true })

        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          navigate("/chat");
          toast.success("Profile updated successfully")
        }
      } catch (error) {

      }
    }
  }

  const handlenavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat")
    }
    else {
      toast.error("Please setup profile.")
    }
  }

  const handleFileInputClick = () => {
    fileInputRef.current.click();

  }
  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData()
      formData.append("profile-image", file);
      const response = await apiClint.post(ADD_PROFILE_IMAGE_ROUTE, formData, { withCredentials: true });
      console.log(response.status)

      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image })
        toast.success("Image update successfully.")
        setImage(`${HOST}/${userInfo.image}`)

      }
    }
  }

  const handleDeleteImage = async () => {
    try {
      const response = await apiClint.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null })
        toast.success("Image removed successfully")
        setImage(null);
        console.log(image)
      }


    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw md:w-max">
        <div onClick={handlenavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 md:h-48 flex items-center justify-center relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {
                image ? (
                  <AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black" />
                ) : (
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                    {
                      firstName ?
                        firstName.split("").shift() :
                        userInfo.email.split("").shift()
                    }
                  </div>
                )
              }
            </Avatar>
            {hovered && <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full ring-fuchsia-50"
              onClick={image ? handleDeleteImage : handleFileInputClick}>
              {image ?
                <FaTrash className="text-white text-3xl cursor-pointer" />
                : <FaPlus className="text-white text-3xl cursor-pointer" />}
            </div>}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleChangeImage}
              name="profile-image"
              accept=".png, .jpg, .jpge, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none " />
            </div>

            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
                onChange={(e) => setFirstName(e.target.value)} />
            </div>

            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
                onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, i) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === i ?
                    " outline outline-white/50 outline-2" : ""
                    }`}
                  key={i}
                  onClick={() => setSelectedColor(i)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChange}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile
