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

export const tabelarization_values = atom({
    key: 'tabelarization_values',
    default: {
        cluster_1: 'Case ID',
        cluster_2: 'Cluster',
    }
})
