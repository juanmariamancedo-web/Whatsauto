import { ApolloError } from "@apollo/client"

export default function GraphQLErrorsComponent({error, setIgnoreError}: {error: ApolloError , setIgnoreError(value: React.SetStateAction<boolean>): void}){
    return(
        <div className="min-h-screen w-full flex justify-center items-center">
            <div className="flex flex-col gap-3 p-3 shadow-xl rounded-xl">
                <p className="text-black dark:text-white">
                    {error.graphQLErrors[0].message}
                </p>
                <button onClick={function(){setIgnoreError(true)}} className="primary-button">Ok</button>
            </div>
        </div>
    )
}