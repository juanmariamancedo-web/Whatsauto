import useTitle from "../../hooks/useTitle"

export default function NotFound(){
    useTitle("Not found")

    return(
        <div className="flex justify-center items-center">
            <div className="p-3 rounded-2xl shadow-xl gap-3 flex flex-col items-center">
                <h1 className="font-mono font-bold text-red-600 dark:text-red-400">
                    Not Found
                </h1>
                <p>404 error</p>
            </div>
        </div>
    )
}