import React from "react";
import { useEffect } from "react";
import { eel } from "../App";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";


const Dataset = () => {
    const [data, setData] = React.useState([]);
    const [schema, setSchema] = React.useState(null);
    const [textValue, setTextValue] = React.useState("Case ID");
    const navigator = useNavigate();
    useEffect(() => {
        eel.get_dataset()().then((dataset) => {
            const d = JSON.parse(dataset);
            //const dd = JSON.parse(datatypes)
            console.log(d);
            //console.log(dd);
            setData(d.data);
            setSchema(d.schema);
        });
    }, []);
    
    const handleEventLogCreation = async () => {
        await eel.dataset_to_eventlog(textValue)()
        return navigator("/eventlog")
    }

    return (
        <div className="p-10">
            <div className="py-10 flex flex-col items-center">
            <Button onClick={handleEventLogCreation} >Utwórz dziennik zdarzeń</Button>
            <input
                    type="text"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)} 
                    className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                />
            </div>
            <div class="overflow-x-auto shadow-md sm:rounded-lg">
                {schema === null ? (<div>loading...</div>) : (
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {schema.fields.map((field) => (
                                    <th scope="col" class="px-6 py-3" key={field.name}>
                                        {field.name}
                                    </th>
                                ))}

                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    {Object.values(row).map((value) => (
                                        <td class="px-6 py-4" key={value}>
                                            {value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}

            </div>
        </div>
    )
}

export default Dataset;