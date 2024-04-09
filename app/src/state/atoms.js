import { atom } from 'recoil'

export const accepted_file = atom({
    key: 'accepted_files',
    default: null
})


export const dataset_inputs_values = atom({
    key: 'dataset_inputs_values',
    default: {
        caseId: 'Case ID',
        timestamp: 'Timestamp',
        cluster: 'Cluster',
    }
})

export const choice1_atom = atom({
    key: 'choice1',
    default: null
}) 

export const choice2_atom = atom({
    key: 'choice2',
    default: null
})
