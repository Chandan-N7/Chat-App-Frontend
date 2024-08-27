import { useAppStore } from '@/store/store'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { getColor } from '@/lib/utils';
import { HOST } from '@/utils/constants';

const ContactList = ({ contacts, isChannel = false }) => {

    const { setSelectedChatData, selectedChatData, setSelectedChatType, setSelectedChatMessages } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);

        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }

    }

    return (
        <div className="mt-5">
            {contacts.map((contact) => (
                <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
                    ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" :
                        "hover:bg-[#f1f1f111] "}`}
                    onClick={() => { handleClick(contact) }} >
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {
                            !isChannel && (
                                <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                                    {
                                        contact.image ? (
                                            <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="object-cover w-full h-full bg-black" />
                                        ) : (
                                            <div className={` ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border border-white/50" : getColor(contact.color)}uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full `}>
                                                {
                                                    contact.firstName ?
                                                        contact.firstName.split("").shift() :
                                                        contact.email.split("").shift()
                                                }
                                            </div>
                                        )
                                    }
                                </Avatar>
                            )}

                        {
                            isChannel && <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
                        }
                        {
                            isChannel ? <span>{contact.name}</span> :
                                <div className="flex flex-col">
                                    <span>
                                        {
                                                contact.firstName && contact.lastName ?
                                                `${contact.firstName} ${contact.lastName}` :
                                                contact.email
                                        }
                                    </span>
                                </div>
                        }

                    </div>
                </div>
            ))}
        </div>
    )
}

export default ContactList;