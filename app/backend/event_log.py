import pandas as pd
import pm4py
import eel

def delete_duplicates(df: pd.DataFrame, name_cluster: str = "Cluster", name_caseid: str = "Case ID"):
    indices_to_delete = []

    for index, row in df.iterrows():
        if index < len(df) - 1:
            next_row = df.loc[index + 1]
            if row[name_cluster] == next_row[name_cluster] and row[name_caseid] == next_row[name_caseid]:
                indices_to_delete.append(index)

    df = df.drop(indices_to_delete)

    return df


def make_event_log_object(df: pd.DataFrame, name_cluster: str = "Cluster", name_caseid: str = "Case ID", name_timestamp: str = "Timestamp"):

    # pm4py requires name_cluster and name_caseid to be of type string
    df[name_caseid] = df[name_caseid].astype(str)
    df[name_cluster] = df[name_cluster].astype(str)


    if not name_timestamp in df.columns.tolist():
        base_date = pd.Timestamp('2024-01-01')
        selected_columns = df[[name_cluster, name_caseid]].copy()
        selected_columns.reset_index(inplace=True)
        selected_columns = delete_duplicates(selected_columns, name_cluster, name_caseid)
        #selected_columns = selected_columns.drop_duplicates(subset=[name_caseid, name_cluster], keep='last')
        selected_columns['Timestamp'] = base_date + pd.to_timedelta(selected_columns['index'], unit='D')
        
        selected_columns.drop(columns=['index'], inplace=True)
        formatted_columns = pm4py.format_dataframe(selected_columns, case_id=name_caseid, activity_key=name_cluster, timestamp_key="Timestamp")
    elif df[name_timestamp].dtype == "float64" or df[name_timestamp].dtype == "int64":
        base_date = pd.Timestamp('2024-01-01')
        selected_columns = df[[name_cluster, name_caseid, name_timestamp]].copy()
        selected_columns = delete_duplicates(selected_columns, name_cluster, name_caseid)
        #selected_columns = selected_columns.drop_duplicates(subset=[name_caseid, name_cluster], keep='last')
        selected_columns['Timestamp'] = base_date + pd.to_timedelta(selected_columns[name_timestamp], unit='D')
        
        selected_columns.drop(columns=[name_timestamp], inplace=True)
        formatted_columns = pm4py.format_dataframe(selected_columns, case_id=name_caseid, activity_key=name_cluster, timestamp_key="Timestamp")
    else:
        selected_columns = df[[name_cluster, name_caseid]].copy()
        selected_columns["Timestamp"] = df[name_timestamp]
        selected_columns = delete_duplicates(selected_columns, name_cluster, name_caseid)
        #selected_columns = selected_columns.drop_duplicates(subset=[name_caseid, name_cluster], keep='last')
        formatted_columns = pm4py.format_dataframe(selected_columns, case_id=name_caseid, activity_key=name_cluster, timestamp_key="Timestamp")
    return formatted_columns

