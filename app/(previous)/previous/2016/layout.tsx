import { Container } from "@mui/system"
import React from "react"
import Category2016 from "./Category"

export default function Layout({children}: {children: React.ReactNode}) {
    return <Container>
        <Category2016 noCategory={false} vertical={false} noHeader={false} />
        {children}
    </Container>
}