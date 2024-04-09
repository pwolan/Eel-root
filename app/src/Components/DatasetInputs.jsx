
import React from "react";
import { useRecoilState } from 'recoil'
import { choice1_atom, choice2_atom, dataset_inputs_values } from "../state/atoms";
import { eel } from "../App";
import Select from 'react-select';


const DatasetInputs = ({ cols, status }) => {
    const [values, setValues] = useRecoilState(dataset_inputs_values)
    const [columns, setColumns] = React.useState([])

    const [choice1, setChoice1] = useRecoilState(choice1_atom)
    const [choice2, setChoice2] = useRecoilState(choice2_atom)

    React.useEffect(() => {
        eel.get_dataset()().then((dataset) => {
            const d = JSON.parse(dataset);
            d.schema.fields = d.schema.fields.filter((el)=> el.name !== "index");
            d.data = d.data.map(({index, ...rest})=>({...rest}))
            const columns_names = d.schema.fields;

            const column_options = columns_names.map(({ name }) => ({
                value: name,
                label: name
            }));
            console.log(column_options);
            setColumns(column_options);

        });
    }, [cols]);

    const handleCaseIdChange = ({value}, {name}) => {
        setValues((prev) => ({ ...prev, caseId: value }))
        eel.set_case_id(value)
    }
    const handleTimestampChange = ({value}, {name}) => {
        setValues((prev) => ({ ...prev, timestamp: value }))
        eel.set_timestamp_id(value)
    }
    const handleClusterChange = ({value}, {name}) => {
        // setValues((prev) => ({ ...prev, cluster: e.target.value }))
        
        setValues((prev) => ({ ...prev, cluster: value }))
        eel.set_cluster_id(value)
    }

    const handleCluster_1_Change = ({ value }, { name }) => {
        setChoice1(value);
        eel.set_cluster_id_1(value)();
    }
    const handleCluster_2_Change = ({ value }, { name }) => {
        setChoice2(value);
        eel.set_cluster_id_2(value)();
    }
    const handleColName = (e) => {
        eel.set_new_column_name(e.target.value)();
    }
    const handleInstr = (e) => {
        eel.set_new_instructions(e.target.value)();
    }
    const handleDefaultVal = (e) => {
        eel.set_new_default_val(e.target.value)();
    }
    return (<>
        <div class=" mx-3 m-6">
            <div className="flex flex-wrap items-center justify-center">
                <div class=" px-3 mb-6 md:mb-0">
                    <label className="block ml-4 text-gray-700 text-sm font-bold">CaseID:</label>
                    <Select
                        classNames={{
                            //    container: (state)=>"!w-40"
                        }}
                        onChange={handleCaseIdChange}
                        // defaultValue={{ value: choice1, label: choice1 }}
                        options={columns}
                        isLoading={columns.length === 0}
                        name="caseID"
                    />
                    {/* <input
                        type="text"
                        value={values.caseId}
                        onChange={handleCaseIdChange}
                        className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                    /> */}
                </div>
                <div class=" px-3 mb-6 md:mb-0">
                    <label className="block ml-4 text-gray-700 text-sm font-bold">Timestamp:</label>
                    <Select
                        classNames={{
                            //    container: (state)=>"!w-40"
                        }}
                        onChange={handleTimestampChange}
                        // defaultValue={{ value: choice1, label: choice1 }}
                        options={columns}
                        isLoading={columns.length === 0}
                        name="timestamp"
                    />
                    {/* <input
                        type="text"
                        value={values.timestamp}
                        onChange={handleTimestampChange}
                        className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                    /> */}
                </div>
                <div class=" px-3 mb-6 md:mb-0">
                    <label className="block ml-4 text-gray-700 text-sm font-bold">Cluster:</label>
                    {/* <input
                        type="text"
                        value={values.cluster}
                        onChange={handleClusterChange}
                        className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                    /> */}
                    <Select
                        classNames={{
                            //    container: (state)=>"!w-40"
                        }}
                        onChange={handleClusterChange}
                        // defaultValue={{ value: choice1, label: choice1 }}
                        options={columns}
                        isLoading={columns.length === 0}
                        name="cluster"
                    />
                </div>
            </div>

            <div>
                <div class="flex flex-wrap justify-center mx-3 mt-6">
                    <div class="px-3 mb-6 md:mb-0">
                        <label className="block ml-4 text-gray-700 text-sm font-bold">Nazwa:</label>
                        <input
                            type="text"
                            onChange={handleColName}
                            className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                        />
                    </div>
  
                    <div class="px-3 mb-6 md:mb-0">
                        <label className="block ml-4 text-gray-700 text-sm font-bold">Wartość domyślna:</label>
                        <input
                            type="text"
                            value={0}
                            onChange={handleDefaultVal}
                            className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                        />
                    </div>
                    <div class="px-3 mb-6 md:mb-0">
                        <label className="block ml-4 text-gray-700 text-sm font-bold">Instrukcje:</label>
                        <textarea
                            type="text"
                            onChange={handleInstr}
                            className="shadow m-4 resize border-2 border-gray-300 bg-white h-20 w-48 px-5 rounded-lg text-sm focus:outline-none mt-5"
                        />
                    </div>
                </div>
                {status && (
                    <div className={`text-center ${status.type === "success" ? "text-green-600" : (status.type === "error" ? "text-red-600" : "")}`}>
                        {status.message}
                    </div>
                )}
            </div>


            <div class="flex flex-wrap justify-center mx-3 my-6">
                <div class="px-3 mb-6 md:mb-0">
                    <label className="block text-gray-700 text-sm font-bold">Cluster_1:</label>
                    <Select
                        classNames={{
                            //    container: (state)=>"!w-40"
                        }}
                        onChange={handleCluster_1_Change}
                        // defaultValue={{ value: choice1, label: choice1 }}
                        options={columns}
                        isLoading={columns.length === 0}
                        name="cluster_1"
                    />

                </div>
                <div class="px-3 mb-6 md:mb-0">
                    <label className="block text-gray-700 text-sm font-bold">Cluster_2:</label>

                    <Select
                        onChange={handleCluster_2_Change}
                        // defaultValue={{ value: choice2 , label: choice2 }}
                        // placeholder="Wybierz kolumne"
                        options={columns}
                        isLoading={columns.length === 0}
                        name="cluster_2"
                    />
                </div>
            </div>
        </div>
    </>)
}


export default DatasetInputs;