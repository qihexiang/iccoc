import { Alert, Box } from "@mui/material";
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
    return [setInformation, open ? <Box sx={{ margin: 1 }}><Alert severity={alertInformation.color}>
        {alertInformation.message}
    </Alert></Box> : null] as const
}