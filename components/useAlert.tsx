import { Alert } from "@mui/material";
import { useEffect, useState } from "react";

export default function useAlert(autoClose: number) {
  const [open, setOpen] = useState(false)
  const [alertInformation, setInformation] = useState<{
    color: "success" | "warning" | "info" | "error", message: string
  }>({ color: "success", message: "" })
  useEffect(() => {
    if (alertInformation.message !== "") {
        setOpen(true)
    }
  }, [alertInformation])
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), autoClose)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [open])
  return [setInformation, open ? <Alert severity={alertInformation.color}>
    {alertInformation.message}
  </Alert> : null] as const
}