import React from "react";
import "./tailwind.css"

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="container">
        {children}
    </div>
}