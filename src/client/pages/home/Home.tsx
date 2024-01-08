import { ChangeEvent, useState, FormEvent } from "react"
import { GET_PROFILE } from "../../graphql/queries";
import { useQuery } from "@apollo/client";
import TableOfSurveys from "./components/TableOfSurveys"
import { format } from "date-fns";
import { Cookies } from "../../utils/cookies";
import useTitle from "../../hooks/useTitle";

function formatDate(fechaOriginal:string){
    // Divide la fecha en sus componentes: año, mes y día
    const [año, mes, día] = fechaOriginal.split("-");

    // Crea una nueva fecha en el formato "01/09/2023" utilizando los componentes
    return `${día}/${mes}/${año}`;
}

const cookies = Cookies()

export default function Home(){
    const [fechaInicio, SetFechaInicio] = useState(format(new Date(), 'dd/MM/yyyy'))
    const [fechaFin, SetFechaFin] = useState(format(new Date(), 'dd/MM/yyyy'))
    
    const [fechaInicioInput, SetFechaInicioInput] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [fechaFinInput, SetFechaFinInput] = useState(format(new Date(), 'yyyy-MM-dd'))

    useTitle("Surveys")

    function changeRangeDate(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        SetFechaInicio(formatDate(fechaInicioInput))
        SetFechaFin(formatDate(fechaFinInput))
    }

    return(
        <div className="h-full flex flex-col gap-3 pt-3">   
            <form onSubmit={changeRangeDate} className="flex justify-center items-center flex-wrap gap-3">
                <label className="flex flex-col gap-3 items-center">
                    <span className="font-bold text-black dark:text-white">Fecha inicial:</span>
                    <input type="date" className="primary-button" value={fechaInicioInput} max={fechaFinInput} onChange={(e:ChangeEvent<HTMLInputElement>)=>SetFechaInicioInput(e.target.value)} />
                </label>
                <label className="flex flex-col gap-3 items-center">
                    <span className="font-bold text-black dark:text-white">Fecha final:</span>
                    <input type="date" className="primary-button" value={fechaFinInput} min={fechaFinInput} onChange={(e:ChangeEvent<HTMLInputElement>)=>SetFechaFinInput(e.target.value)} />
                </label>
                <button type="submit" className="primary-button self-end"> 
                    Cargar valores
                </button>
            </form>
            {fechaInicio && fechaFin? <TableOfSurveys fechaInicio={fechaInicio} fechaFin={fechaFin} />: null}
        </div>
    )
}