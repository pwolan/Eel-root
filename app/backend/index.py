import pandas as pd

database = {
    "csv_files": []
}
temp_data = pd.DataFrame()
path_file_csv = None


def read_data():
    global temp_data, path_file_csv
    temp_data = pd.read_csv(path_file_csv, sep=';')
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
