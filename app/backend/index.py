import pandas as pd
import numpy as np
import json
import pm4py
from backend.new_columns import new_column
from backend.event_log import make_event_log_object

database = {
    "csv_files": []
}

temp_data = pd.DataFrame()
temp_data_event_log = pd.DataFrame()
path_file_csv = None


def read_data():
    global temp_data, path_file_csv
    temp_data = pd.read_csv(path_file_csv, sep=None, decimal=",", parse_dates=True, engine='python')
    if 'Timestamp' in temp_data.columns:
        temp_data = temp_data.sort_values(by='Timestamp')
    print(temp_data)


def delete_records():
    global temp_data
    temp_data = temp_data.drop_duplicates(subset=['Case ID', 'Cluster'], keep='last')
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


def add_new_column(new_column_name: str, instructions, default_val=0):
    global temp_data
    new_column(temp_data, new_column_name, instructions, default_val)

def make_event_log(name_caseid: str):
    global temp_data, temp_data_event_log
    temp_data_event_log = make_event_log_object(temp_data, name_caseid=name_caseid, name_timestamp="Timesta")

def make_event_log_and_visualize(file_path: str, name_caseid: str):
    #TODO only visualization, do not change make_event_log, create new function!
    # global temp_data, temp_data_event_log
    # temp_data_event_log = make_event_log(temp_data, "petri"+file_path+".png", "heu"+file_path+".png", name_caseid=name_caseid)
    # print(temp_data_event_log)
    return "petri"+file_path+".png"

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

def get_eventlog():
    global temp_data_event_log
    temp = temp_data_event_log.drop(columns=["case:concept:name", "concept:name", "time:timestamp", "@@index", "@@case_index"])
    temp["Timestamp"] = temp["Timestamp"].apply(lambda x: str(x))
    return temp.to_json(orient='table')



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