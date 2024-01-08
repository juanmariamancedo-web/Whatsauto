import { useEffect } from "react";

export default function useTitle(title: string){
    useEffect(function(){
        document.title = `WhatsAuto | ${title}`
    }, [title])
}