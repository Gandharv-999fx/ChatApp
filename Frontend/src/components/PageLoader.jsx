import React from 'react'
import { LoaderIcon } from "lucide-react"

export const PageLoader = () => {
    return (
        <div className="flex item-center justify-center h-screen">
            <LoaderIcon className="size-10 animate-spin" />
        </div>
    )
}
