import React from "react";
import { useRecoilState } from 'recoil'
import { dataset_inputs_values, tabelarization_values } from "../state/atoms";
import { eel } from "../App";
import Select from 'react-select';


const DatasetInputs = () => {
    const [values, setValues] = useRecoilState(dataset_inputs_values)
    const [tabValues, setTabValues] = useRecoilState(tabelarization_values)
    const [columns, setColumns] = React.useState([])
    const [choice1, setChoice1] = React.useState(null)
    const [choice2, setChoice2] = React.useState(null)

    React.useEffect(() => {
        eel.get_dataset()().then((dataset) => {
            const d = JSON.parse(dataset);
            // console.log(d);
            const columns_names = d.schema.fields;
            console.log(columns_names);
            const column_options = columns_names.map(name => ({
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
        setChoice1(name);
        eel.set_cluster_id_1(name);
        // setTabValues((prev) => ({...prev, cluster_1: e.target.value}))
        // eel.set_cluster_id_1(e.target.value)
    }
    const handleCluster_2_Change = ({value}, {name}) => {
        setChoice2(name);
        eel.set_cluster_id_2(name);
        // setTabValues((prev) => ({...prev, cluster_2: e.target.value}))
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
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold">Cluster_1:</label>
            <Select 
                value={choice1}
                onChange={handleCluster_1_Change}
                options={columns}
                isLoading={columns.length === 0}
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
                value={choice2}
                onChange={handleCluster_2_Change}
                options={columns}
                isLoading={columns.length === 0}
            />
            </div>
        </div>
             
    </>)
}


export default DatasetInputs;