import { Outlet } from "react-router-dom"
import Header from "./header/Header"

export default function LayoutWithHeader(){
    return(
    <div className="App min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-900 dark:to-blue-900">
      <Header />
      <div className="pt-14 min-h-[calc(100vh-56px)] flex justify-center">
        <Outlet />
      </div>
    </div>
    )
}