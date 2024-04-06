import React from "react";
import { useRecoilState } from 'recoil'
import { dataset_inputs_values } from "../state/atoms";
import { eel } from "../App";

const DatasetInputs = () => {
    const [values, setValues] = useRecoilState(dataset_inputs_values)
    
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
    
    return (<>
        <input
            type="text"
            value={values.caseId}
            onChange={handleCaseIdChange}
            className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
        />
        <input
            type="text"
            value={values.timestamp}
            onChange={handleTimestampChange}
            className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
        />
        <input
            type="text"
            value={ values.cluster}
            onChange={handleClusterChange}
            className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none mt-5"
        />
    </>)
}


export default DatasetInputs;