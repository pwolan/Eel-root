import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eel } from "../App";
import Button from "../Components/Button";
const EventLog = () => {

    const [data, setData] = useState([]);
    const [schema, setSchema] = useState(null);
    const navigator = useNavigate();
    useEffect(() => {
        eel.get_eventlog()().then((evlog) => {
            const d = JSON.parse(evlog);
            console.log(d);
            setData(d.data);
            setSchema(d.schema);
        })
    }, []);

    const handleGoToDataset = async () => {
        return navigator("/dataset")
    }
      const handleGoToModel = async () => {
        return navigator("/model")
    }

    const handleDownloadEventLog = async () => {
        eel.download_eventlog()().then((ee) => {
            console.log(ee)
        })
    }
    const handleShowStatistics = async () => {
        return navigator("/eventstatistics")
    }

        return (
        <div className="p-10">
            <Button onClick={handleGoToDataset} className=" !w-24">Powrót</Button>
            <div className="py-10 flex flex-col items-center">
                <Button onClick={handleDownloadEventLog} >Pobierz dane</Button>
                <Button onClick={handleShowStatistics} >Wyświetl statystyki dziennika</Button>
                <Button onClick={handleGoToModel}>Model</Button>
            </div>
            <div class="overflow-x-auto shadow-md sm:rounded-lg">
                {schema === null ? (<div>loading...</div>) : (
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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

export default EventLog;