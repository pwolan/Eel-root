import React from "react";
import { useEffect } from "react";
import { eel } from "../App";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import DatasetInputs from "../Components/DatasetInputs";
import { useRecoilValue } from "recoil";
import { dataset_inputs_values } from "../state/atoms";

const Dataset = () => {
    const [data, setData] = React.useState([]);
    const [schema, setSchema] = React.useState(null);
    // const [textValue, setTextValue] = React.useState("Case ID");
    const [options, setOptions] = React.useState([]); // [ {label: "string", value: "string"}, {label: "int", value: "int"}
    const inputValues = useRecoilValue(dataset_inputs_values)
    const navigator = useNavigate();
    useEffect(() => {
        eel.get_dataset()().then((dataset) => {
            const d = JSON.parse(dataset);
            console.log(d);
            setData(d.data);
            setSchema(d.schema);

        });
        eel.get_datatypes()().then((datatypes) => {
            const d = JSON.parse(datatypes);
            setOptions(d.map((el)=>({label: el, value: el})))
        })
    }, []);
    
    const handleEventLogCreation = async () => {
        console.log(inputValues)
        await eel.dataset_to_eventlog(inputValues)()
        return navigator("/eventlog")
    }

    const handleChange = ({value}, {name}) => {
        console.log(value, name)
        setSchema(prev=>{
            const toChange = prev.fields.find((el)=> el.name === name);
            toChange.type = value;
            toChange.status = "changed";
            return prev
        })
    };

    const handleSubmitTypes = async () => {
        const changes = schema.fields.filter((el)=> el.status === "changed");
        console.log(changes)
        const res = await eel.change_datatypes(changes)()
        console.log(res)
        setSchema(prev => {
            changes.forEach((el) => {
                el.status = res[el.name]
            })
            return {...prev}
        })
    }
   
    return (
        <div className="p-4">
            <div>
            <Button onClick={()=>navigator("/")} className=" !w-20 ">Wróć</Button>
            </div>
            <div className="py-10 flex flex-col items-center">
            <Button onClick={handleEventLogCreation} >Utwórz dziennik zdarzeń</Button>
            <Button onClick={handleSubmitTypes} >Zatwierdź zmianę typów</Button>
            <DatasetInputs />
            </div>
            <div class="overflow-x-auto shadow-md sm:rounded-lg">
                {schema === null ? (<div>wczytywanie danych...</div>) : (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {schema.fields.map((field) => (
                                    <th scope="col" class="px-6 py-3" key={field.name}>
                                        <div>{field.name}</div>
                                        {/*po zapisie <div>{field.type}</div> */}
                                        <div>
                                            <Select 
                                                classNames={{
                                                    control: (state)=> field.status === "changed" ? "!border-yellow-700" : (field.status === "error" ? "!border-red-700" : ""),
                                                    indicatorsContainer: (state)=>" !hidden "
                                                }}
                                                defaultValue={{label: field.type, value: field.type}}
                                                options={options}
                                                isLoading={options.length === 0}
                                                onChange={handleChange}
                                                name={field.name}
                                            />
                                        </div>
                                    </th>
                                ))}

                            </tr>
                        </thead>
                        <tbody>
                        
                            {data.map((row) => (
                                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={row.index}>
                                    {Object.values(row).map((value) => (
                                        <td class="px-6 py-4" key={`${value}xx`}>
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