import { Metadata } from 'next'
import Head from '@/components/Head'
import Foot from '@/components/Foot'
import { Container } from '@mui/material'

export const metadata: Metadata = {
    title: "ICCOC2023",
    description: "Homepage of International Conference of Computational Organometallic Chemistry",
    keywords: [
        "ICCOC", "Catalyst", "Chemistry", "Computational Chemistry", "Organometallic Chemistry"
    ]
}

export default function RootLayout({
    children
}: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Head></Head>
                {/* <Container> */}
                    {children}
                {/* </Container> */}
                <Foot></Foot>
            </body>
        </html>
    )
}