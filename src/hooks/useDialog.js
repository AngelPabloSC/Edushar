import  { useState } from 'react'

export const useDialong = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [dialongContent, setDialongContent] = useState({title:"",message:""})
    const handleOpenDialog=()=>{
        setIsOpen(true)

    }
    const handleCloseDialog=()=>{
        setIsOpen(false)
        
    }
  return {
    isOpen,
    dialongContent,
    handleOpenDialog,
    handleCloseDialog,
    setDialongContent,
  }
}
