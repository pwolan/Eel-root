
import React from "react";
import { useRecoilState } from 'recoil'
import { choice1_atom, choice2_atom, dataset_inputs_values } from "../state/atoms";
import { eel } from "../App";
import Select from 'react-select';


const DatasetInputs = () => {
    const [values, setValues] = useRecoilState(dataset_inputs_values)
    const [columns, setColumns] = React.useState([])

    const [choice1, setChoice1]  = useRecoilState(choice1_atom)
    const [choice2, setChoice2]  = useRecoilState(choice2_atom)

    React.useEffect(() => {
        eel.get_dataset()().then((dataset) => {
            const d = JSON.parse(dataset);
            // console.log(d);
            const columns_names = d.schema.fields;
            console.log(columns_names);
            const column_options = columns_names.map(({name}) => ({
                value: name,
                label: name
            }));
            console.log(column_options);
            setColumns(column_options);

        });
    }, []);

    const handleCaseIdChange = (e) => {
        setValues((prev) => ({...prev, caseId: e.target.value}))
        eel.set_case_id(e.target.value)
    }
    const handleTimestampChange = (e) => {
        setValues((prev) => ({...prev, timestamp: e.target.value}))
        eel.set_timestamp_id(e.target.value)
    }
    const handleClusterChange = (e) => {
        setValues((prev) => ({...prev, cluster: e.target.value}))
        eel.set_cluster_id(e.target.value)
    }

    const handleCluster_1_Change = ({value}, {name}) => {
        setChoice1(value);
        eel.set_cluster_id_1(value)();
    }
    const handleCluster_2_Change = ({value}, {name}) => {
        setChoice2(value);
        eel.set_cluster_id_2(value)();
    }
    const handleColName = (e) => {
            setTabValues((prev) => ({...prev, colName: e.target.value}))
            eel.set_new_column_name(e.target.value)();

            // eel.set_cluster_id_2(e.target.value)
        }
    const handleInstr = (e) => {
        setTabValues((prev) => ({...prev, instructions: e.target.value}))
        eel.set_new_instructions(e.target.value)();

        // eel.set_cluster_id_2(e.target.value)
    }

    const handleDefaultVal = (e) => {
        setTabValues((prev) => ({...prev, defaultVal: e.target.value}))
        eel.set_new_default_val(e.target.value)();

        // eel.set_cluster_id_2(e.target.value)
    }
    return (<>
        <div class="flex flex-wrap -mx-3 m-6">
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold">CaseID:</label>
            <input
                type="text"
                value={values.caseId}
                onChange={handleCaseIdChange}
                className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
            />
            </div>
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold">Timestamp:</label>
            <input
                type="text"
                value={values.timestamp}
                onChange={handleTimestampChange}
                className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
            />
            </div>
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold">Cluster:</label>
            <input
                type="text"
                value={ values.cluster}
                onChange={handleClusterChange}
                className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
            />
            </div>

            <div class="flex flex-wrap -mx-3 m-6">
                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block text-gray-700 text-sm font-bold">Nazwa:</label>
                <input
                    type="text"
                    value={values.colName}
                    onChange={handleColName}
                    className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                />
                </div>
                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block text-gray-700 text-sm font-bold">Instrukcje:</label>
                <input
                    type="text"
                    value={values.instructions}
                    onChange={handleInstr}
                    className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                />
                </div>
                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block text-gray-700 text-sm font-bold">Wartość domyślna:</label>
                <input
                    type="text"
                    value={values.defaultVal}
                    onChange={handleDefaultVal}
                    className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                />
                </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block text-gray-700 text-sm font-bold">Cluster_1:</label>
                <Select
                    onChange={handleCluster_1_Change}
                    options={columns}
                    isLoading={columns.length === 0}
                    name="cluster_1"
                />
                {/* <input
                    type="text"
                    value={tabValues.cluster_1}
                    onChange={handleCluster_1_Change}
                    className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                /> */}
                </div>
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block text-gray-700 text-sm font-bold">Cluster_2:</label>
                {/* <input
                    type="text"
                    value={tabValues.cluster_2}
                    onChange={handleCluster_2_Change}
                    className="shadow m-4 border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
                /> */}
                <Select
                    onChange={handleCluster_2_Change}
                    options={columns}
                    isLoading={columns.length === 0}
                    name="cluster_2"
                />
                </div>
            </div>

        </>)
    }


    export default DatasetInputs;