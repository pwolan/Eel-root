import pandas as pd
import numpy as np
import json
import pm4py
import os
from backend.new_columns import new_column
from backend.event_log import make_event_log_object
from copy import deepcopy

database = {
    "csv_files": []
}

temp_data = pd.DataFrame()
temp_data_event_log = pd.DataFrame()
temp_tabelarization_data = pd.DataFrame()
temp_tabelarization_percentage = None
path_file_csv = None
net, im, fm = None, None, None
case_id = "Case ID"  # Case ID name in temp_data_event_log
cluster_id = "Cluster"  # Cluster ID name in temp_data_event_log
timestamp_id = "Timestamp"
cluster_id_1 = "Cluster 1"
cluster_id_2 = "Cluster 2"
# Timestamp name in temp_data; Timestamp name in temp_data_event_log is always "Timestamp"
# Timestamp in temp_data_event_log = timestamp_id in temp_data if timestamp_id in temp_data else made from index column
new_column_name = "New Column"
new_column_instructions = ""
new_column_default_val = "0"


def read_data(separator: str):
    global temp_data, path_file_csv
    global timestamp_id
    temp_data = pd.read_csv(path_file_csv, sep=separator, decimal=",", parse_dates=True, engine='python')
    # List of possible separators
    # possible_separators = ['\t', ';', ',', '.']  # Add other separators as needed

    # Try reading the file with different separators
    # for separator in possible_separators:
    #     try:
    #         temp_data = pd.read_csv(path_file_csv, sep=separator, decimal=",", parse_dates=True)
    #         # If reading succeeds, break the loop
    #         break
    #     except pd.errors.ParserError:
    #         # If reading fails, try the next separator
    #         continue
    if timestamp_id in temp_data.columns:
        temp_data = temp_data.sort_values(by=timestamp_id)
    print(temp_data)


def delete_records():
    global temp_data
    global case_id, cluster_id
    temp_data = temp_data.drop_duplicates(subset=[case_id, cluster_id], keep='last')
    print(temp_data)


def set_path(path: str):
    global path_file_csv
    path_file_csv = path

def read_path():
    global path_file_csv
    return path_file_csv


def get_data():
    global temp_data
    return temp_data.to_json(orient='table')

def get_dataframe():
    global temp_data
    return temp_data


def set_case_id(new_case_id: str):
    global case_id
    case_id = new_case_id


def set_cluster_id(new_cluster_id: str):
    global cluster_id
    cluster_id = new_cluster_id


def set_timestamp_id(new_timestamp: str):
    global timestamp_id
    timestamp_id = new_timestamp

def set_cluster_id_1(new_cluster_id_1: str):
    print(new_cluster_id_1)
    global cluster_id_1
    cluster_id_1 = new_cluster_id_1

def set_cluster_id_2(new_cluster_id_2: str):
    print(new_cluster_id_2)
    global cluster_id_2
    cluster_id_2 = new_cluster_id_2

def set_new_column_name(new_new_column: str):
    global new_column_name
    new_column_name = new_new_column

def set_new_instructions(new_instructions: str):
    global new_column_instructions
    new_column_instructions = new_instructions

def set_new_default_val(new_default_val: str):
    global new_column_default_val
    new_column_default_val = new_default_val

def get_dtypes():
    global temp_data
    temp_list = []
    for column in temp_data:
        temp_list.append(temp_data[column].dtype.type)
    #column_dtype = temp_data[column_name].dtype
    temp_list = [dtype.__name__ for dtype in temp_list]
    cleaned_data_types = [data_type.replace('64', '').replace('_', '') for data_type in temp_list]
    cleaned_data_types = list(dict.fromkeys(cleaned_data_types))

    print(cleaned_data_types)
    return json.dumps(cleaned_data_types)


def set_dtype(column_name: str, new_dtype: object):
    global temp_data
    temp_data[column_name] = temp_data[column_name].astype(new_dtype)


def convert_to_datetime(column_name: str):
    global temp_data
    temp_data[column_name] = pd.to_datetime(temp_data[column_name], format="%d.%m.%Y %H:%M")


def add_new_column():
    global temp_data
    global new_column_name, new_column_instructions, new_column_default_val

    if type(new_column_instructions) is list:
        return None
    new_column_instructions = new_column_instructions.split(';')
    df2 = deepcopy(temp_data)
    for i in range(len(new_column_instructions)):
        single_if = new_column_instructions[i].split(',')
        if len(single_if) != 2:
            return f" błąd w instrukcji o numerze {i}"
        new_column_instructions[i] = tuple(single_if)

    print(new_column_instructions)
    res = new_column(temp_data, new_column_name, new_column_instructions, new_column_default_val)
    if res != "OK":
        temp_data = df2

    return res


def make_event_log():
    global temp_data, temp_data_event_log
    global case_id, cluster_id, timestamp_id
    print(case_id, cluster_id, timestamp_id)
    temp_data_event_log = make_event_log_object(temp_data, name_cluster=cluster_id, name_caseid=case_id, name_timestamp=timestamp_id)


def visualize(algos: str):
    #TODO only visualization, do not change make_event_log, create new function!
    # global temp_data, temp_data_event_log
    # temp_data_event_log = make_event_log(temp_data, "petri"+file_path+".png", "heu"+file_path+".png", name_caseid=name_caseid)
    # print(temp_data_event_log)
    global temp_data_event_log
    global path_file_csv
    global net, im, fm
    global case_id, cluster_id
    if algos == 'inductive':
        net, im, fm = pm4py.discover_petri_net_inductive(temp_data_event_log, activity_key=cluster_id,
                                                          case_id_key=case_id, timestamp_key="Timestamp")

    elif algos == 'heuristic':
        net, im, fm = pm4py.discover_petri_net_heuristics(temp_data_event_log, activity_key=cluster_id,
                                                          case_id_key=case_id, timestamp_key="Timestamp")
    else:
        return
    directory = os.path.dirname(path_file_csv)
    name = "petri_" + algos + "_miner.png"
    pm4py.save_vis_petri_net(net, im, fm, directory + "\\" + name)
    log = pm4py.convert_to_event_log(temp_data_event_log)
    return directory + "\\" + name


def model_statistics(name_cluster: str = "Cluster", name_caseid: str = "Case ID", name_timestamp: str = "Timestamp"):
    global temp_data_event_log, path_file_csv
    global net, im, fm
    global case_id, cluster_id
    if net is None:
        print("uruchom najpierw jeden z algorytmów")
        return None
    return pm4py.fitness_alignments(temp_data_event_log, net, im, fm, activity_key=cluster_id, case_id_key=case_id,
                             timestamp_key="Timestamp")


def event_log_statistics():
    global temp_data_event_log
    start_activities = pm4py.get_start_activities(temp_data_event_log)
    counted_cases = 0
    for start_activity in start_activities:
        counted_cases += start_activities[start_activity]
    variants = pm4py.stats.get_variants(temp_data_event_log)
    counted_case_length = {}
    for variant in variants:
        if len(variant) in counted_case_length:
            counted_case_length[len(variant)] += variants[variant]
        else:
            counted_case_length[len(variant)] = variants[variant]
    print(start_activities, counted_cases)
    print(pm4py.get_end_activities(temp_data_event_log))
    print(variants, counted_case_length)
    #print(pm4py.stats.get_variants_paths_duration(temp_data_event_log))

def download_event_log(): #TODO test this shit
    global temp_data_event_log
    directory = os.path.dirname(path_file_csv)
    print(temp_data_event_log)
    dataframe = pm4py.convert_to_dataframe(temp_data_event_log)
    print(dataframe)
    df_first_three = dataframe.iloc[:, :3]
    print(df_first_three)
    df_first_three.to_csv(directory + "\\" +'exported_event_log.csv', index=False)


def get_eventlog():
    global temp_data_event_log
    temp = temp_data_event_log.drop(columns=["case:concept:name", "concept:name", "time:timestamp", "@@index", "@@case_index"])
    temp["Timestamp"] = temp["Timestamp"].apply(lambda x: str(x))
    return temp.to_json(orient='table')


def column_diff_df(first_column: str, second_column: str):
    global temp_data
    # df_filtered = temp_data[temp_data[first_column] != temp_data[second_column]]
    nowy_df = pd.DataFrame()
    nowy_df['column_difference'] = temp_data.apply(lambda row: row[first_column] == row[second_column], axis=1)
    return nowy_df


def calculate_percentage_of_different_values(first_column: str, second_column: str):
    global temp_data
    total_records = len(temp_data)
    df_filtered = temp_data[temp_data[first_column] != temp_data[second_column]]
    different_records = len(df_filtered)
    percentage = (different_records / total_records) * 100
    return percentage


def make_tabelarisation(columns):
    global cluster_id_1, cluster_id_2, temp_tabelarization_data, temp_tabelarization_percentage
    column_diff = column_diff_df(cluster_id_1, cluster_id_2)
    print(column_diff)
    temp_tabelarization_percentage = calculate_percentage_of_different_values(cluster_id_1, cluster_id_2)
    temp_tabelarization_data = temp_data[['ID', cluster_id_1, cluster_id_2]].copy()
    temp_tabelarization_data['column_difference'] = column_diff['column_difference'].to_list()
    return temp_tabelarization_data.to_json(orient="table"), temp_tabelarization_percentage

def get_tabelarisation_data():
    return temp_tabelarization_data.to_json(orient="table")

def get_tabelarisation_percentage():
    return temp_tabelarization_percentage
    


"""
# example usage - showcase of new_column syntax

read_path("example.csv")
read_data()
convert_to_datetime("Timestamp")
set_dtype("Zmienna G", str)

if_instructions = [
                   ("['Zmienna C'] > 50", "2 * ['Zmienna C']"),
                   ("['Zmienna A'] > 160", "['Zmienna A'] - ['Zmienna C']"),
                   # ("['Zmienna A'] > 0", "exit(0)") eval is UNSAFE if you use exit(0) in val the program will end
                   ]
add_new_column("nowa kolumna", if_instructions, 0)

print(temp_data.head())
print(temp_data.dtypes)
make_event_log_and_visualize("net")


"""