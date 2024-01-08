import { useEffect, useState } from "react"

export default function Success({children}: {children: JSX.Element}){
    const [complete, setComplete] = useState(false)

    useEffect(()=>{
        setTimeout(()=>{
            setComplete(true)
        }, 3000)
    }, [])

    if(!complete) return (
        <div className="min-h-screen w-full flex justify-center items-center">
            <section className="shadow-2xl rounded-2xl p-3 flex flex-col gap-3 border-green-600 border-2 bg-yellow-400 text-black dark:bg-white dark:text-black">
                <p className="font-bold text-black">
                    Success
                </p>
            </section>
        </div>
    )

    return children
}