import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eel } from "../App";
import Button from "../Components/Button";
const Tabelarisation = () => {
    const [data, setData] = useState([]);
    const [schema, setSchema] = useState(null);
    const navigator = useNavigate();
    const [percentage, setPercentage] = useState(null)
    useEffect(() => {
        eel.get_tabelarisation_data()().then((evlog) => {
            const d = JSON.parse(evlog);
            console.log(d);
            d.schema.fields = d.schema.fields.filter((el)=> el.name !== "index");
            d.data = d.data.map(({index, ...rest})=>({...rest}))
            setData(d.data);
            setSchema(d.schema);
        })
        eel.get_tabelarisation_percentage()().then((percentage) => {
            setPercentage(percentage)
        });
    }, []);

    const handleGoToDataset = async () => {
        return navigator("/dataset")
    }
    return (
        <div className="p-4">
            <div>
                <Button onClick={handleGoToDataset} className=' !w-24 '>Powrót</Button>
            </div>
            <div  className="py-10 flex flex-col items-center">
                <label className="block text-gray-700 text-sm font-bold">Procent takich samych wierszy: {percentage}%</label>
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
                                        <td class={`px-6 py-4 ${
                                            value === 'True'
                                              ? 'text-green-500'
                                              : (value === 'False'
                                              ? 'text-red-500'
                                              : 'text-gray-500')
                                          }`} key={value}>
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
    );
}

export default Tabelarisation;