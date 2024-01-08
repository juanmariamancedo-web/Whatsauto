import { type Survey } from "../../../../models/survey";
import { GET_SURVEYS_BETWEEN_TWO_DATES } from "../../../graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { useState, useEffect, FormEvent } from "react";
import { utils, writeFile } from "xlsx";
import HeaderOfTable from "./HeaderOfTable";
import { Cookies } from "../../../utils/cookies";
import Loading from "../../../components/Loading";
import GraphQLErrorsComponent from "../../../components/GraphQLErrorsComponent";

const cookies = Cookies()

export default function TableOfSurveys({fechaInicio, fechaFin}: {fechaInicio:string, fechaFin:string}){
    const [getSurveys, {loading, data, error}] = useLazyQuery(GET_SURVEYS_BETWEEN_TWO_DATES)
    const [small, setSmall] = useState(false)
    const [ignoreError, setIgnoreError] = useState(false)

    useEffect(()=>{
        getSurveys({
            variables:{
                fechaInicio,
                fechaFin
            },
            context: {
                headers: {
                    authorization: `bearer ${cookies.getCookie("token")}`
                }
            }
        })
    }, [fechaInicio, fechaFin])

    useEffect(()=>{
        const consulta = window.matchMedia("(max-width: 1279px)")

        if(consulta.matches) setSmall(true)

        consulta.onchange = ()=>{
            setSmall(consulta.matches)
        }

    }, [])

    function createExcel(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        const csvData = data?.filterSurveysForRangeDate.map((survey:Survey)=>{
            return [survey.createdAt, survey.firstQuestion, survey.secondQuestion, survey.thirdQuestion, survey.fourthQuestion, survey.fifthQuestion, survey.sixthQuestion, survey.seventhQuestion, survey.comentaries, survey.chat.phone]
        })

        const csv = [
            ["Marca horaria", "firstQuestion", "secondQuestion", "thirdQuestion", "fourthQuestion", "fifthQuestion", "sixthQuestion", "seventhQuestion", "comentaries", "chat.phone"],
            ...csvData
        ]

        const workbook = utils.book_new();
        const worksheet = utils.aoa_to_sheet(csv);

        utils.book_append_sheet(workbook, worksheet, "MiHojaDeCalculo");

        writeFile(workbook, "miarchivo.xlsx");
    }

    if(loading) return <Loading />
    if(error && !ignoreError) return <GraphQLErrorsComponent error={error} setIgnoreError={setIgnoreError} />

    if (data) return(
            <div className="flex flex-col items-center gap-3 p-3">   
                <section className="container grid grid-cols-4 xl:grid-cols-10 gap-3">
                    {small || (<header className="col-span-full grid grid-cols-10">
                        <HeaderOfTable />
                    </header>)}
                    {data.filterSurveysForRangeDate.map((survey:Survey)=>{
                        return(
                            <article key={survey.id} className="rounded-2xl shadow-xl bg-blue-500 dark:bg-cyan-900 text-black dark:text-white col-span-full grid grid-rows-10 xl:grid-rows-1 grid-cols-[repeat(4,_minmax(auto, 1fr))] xl:grid-cols-[subgrid] overflow-hidden">
                                {small? <HeaderOfTable /> : null}
                                <ul className="row-span-full col-span-3 xl:col-span-10 grid grid-cols-1 xl:grid-cols-[subgrid] grid-rows-[subgrid]">
                                    <li className="p-3">
                                        {survey.createdAt}
                                    </li>
                                    <li className="p-3">
                                        {survey.firstQuestion}
                                    </li>
                                    <li className="p-3">
                                        {survey.secondQuestion}
                                    </li>
                                    <li className="p-3">
                                        {survey.thirdQuestion}
                                    </li>
                                    <li className="p-3">
                                        {survey.fourthQuestion}
                                    </li>
                                    <li className="p-3">
                                        {survey.fifthQuestion}
                                    </li>
                                    <li className="p-3">
                                        {survey.sixthQuestion}
                                    </li>
                                    <li className="p-3">
                                        {survey.seventhQuestion}
                                    </li>
                                    <li className="p-3">
                                        {survey.comentaries}
                                    </li>
                                    <li className="p-3">
                                        {survey.chat.phone}
                                    </li>
                                </ul>
                            </article>
                        )
                    })}
                </section>
                <form onSubmit={createExcel}>
                    <button type="submit" className="primary-button rounded-xl">Crear Excel</button>
                </form>
            </div>
    )
}