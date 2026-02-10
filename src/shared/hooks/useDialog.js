import { useState } from 'react'

export const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({ title: "", message: "" })
  const handleOpenDialog = () => {
    setIsOpen(true)

  }
  const handleCloseDialog = () => {
    setIsOpen(false)

  }

  return {
    isOpen,
    dialogContent,
    handleOpenDialog,
    handleCloseDialog,
    setDialogContent,
  }
}
