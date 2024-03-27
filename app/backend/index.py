import pandas as pd
from backend.new_columns import new_column
from backend.event_log import make_event_log

database = {
    "csv_files": []
}
temp_data = pd.DataFrame()
path_file_csv = None


def read_data():
    global temp_data, path_file_csv
    temp_data = pd.read_csv(path_file_csv, sep=',', decimal=",", parse_dates=True)
    if 'Timestamp' in temp_data.columns:
        temp_data = temp_data.sort_values(by='Timestamp')
    print(temp_data)


def delete_records():
    global temp_data
    temp_data = temp_data.drop_duplicates(subset=['Case ID', 'Cluster'], keep='first')
    print(temp_data)


def read_path(path: str):
    global path_file_csv
    path_file_csv = path


def get_data():
    global temp_data
    return temp_data.to_json()


def get_dtype(column_name: str):
    global temp_data
    column_dtype = temp_data[column_name].dtype
    return column_dtype


def set_dtype(column_name: str, new_dtype: object):
    global temp_data
    temp_data[column_name] = temp_data[column_name].astype(new_dtype)


def convert_to_datetime(column_name: str):
    global temp_data
    temp_data[column_name] = pd.to_datetime(temp_data[column_name], format="%d.%m.%Y %H:%M")


def add_new_column(new_column_name: str, instructions, default_val=0):
    global temp_data
    new_column(temp_data, new_column_name, instructions, default_val)


def make_event_log_and_visualize(file_path: str):
    global temp_data
    make_event_log(temp_data, "petri"+file_path+".png", "heu"+file_path+".png")
    return "petri"+file_path+".png"



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