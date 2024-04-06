import pandas as pd
import pm4py
import eel

def make_event_log_object(df: pd.DataFrame, name_cluster: str = "Cluster", name_caseid: str = "Case ID", name_timestamp: str = "Timestamp"):

    # pm4py requires name_cluster and name_caseid to be of type string
    df[name_caseid] = df[name_caseid].astype(str)
    df[name_cluster] = df[name_cluster].astype(str)


    if not name_timestamp in df.columns.tolist(): #TODO - make fake timestamps to stop pm4py potential crash
        base_date = pd.Timestamp('2024-01-01')
        selected_columns = df[[name_cluster, name_caseid]].copy()
        selected_columns.reset_index(inplace=True)
        selected_columns = selected_columns.drop_duplicates(subset=[name_caseid, name_cluster], keep='last')
        selected_columns['Timestamp'] = base_date + pd.to_timedelta(selected_columns['index'], unit='D')

        selected_columns.drop(columns=['index'], inplace=True)
        formatted_columns = pm4py.format_dataframe(selected_columns, case_id=name_caseid, activity_key=name_cluster, timestamp_key="Timestamp")
    else:
        selected_columns = df[[name_cluster, name_caseid]].copy()
        selected_columns["Timestamp"] = df[name_timestamp]
        selected_columns = selected_columns.drop_duplicates(subset=[name_caseid, name_cluster], keep='last')
        formatted_columns = pm4py.format_dataframe(selected_columns, case_id=name_caseid, activity_key=name_cluster, timestamp_key="Timestamp")
    # net, im, fm = pm4py.discover_petri_net_alpha(formatted_columns, activity_key=name_cluster, case_id_key=name_caseid, timestamp_key=name_timestamp)
    # pm4py.save_vis_petri_net(net, im, fm, petri_net_path)
    # heu_net = pm4py.discover_heuristics_net(formatted_columns, activity_key=name_cluster, case_id_key=name_caseid, timestamp_key=name_timestamp)
    # pm4py.save_vis_heuristics_net(heu_net, heu_net_path)
    #log = pm4py.convert_to_event_log(formatted_columns)
    #print(log)
    return formatted_columns

