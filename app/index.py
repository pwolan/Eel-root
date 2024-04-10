"""Main Python application file for the EEL-CRA demo."""

import os
import platform
import random
import sys
import bottle

import wx
import eel
import pandas as pd
# import pm4py

from backend.new_columns import new_column
import backend.index as bc

@eel.expose
def dataset_to_eventlog(columns):
    bc.make_event_log()
    return bc.get_data()

@eel.expose
def dataset_to_tabelarisation():
    return bc.make_tabelarisation()

@eel.expose
def get_tabelarisation_data():
    return bc.get_tabelarisation_data()

@eel.expose
def get_eventlog_statistics():
    return bc.event_log_statistics()

@eel.expose
def set_case_id(new_case_id: str):
    return bc.set_case_id(new_case_id)

@eel.expose
def get_tabelarisation_percentage():
    return bc.get_tabelarisation_percentage()


@eel.expose
def set_cluster_id(new_cluster_id: str):
    return bc.set_cluster_id(new_cluster_id)


@eel.expose
def set_timestamp_id(new_timestamp: str):
    return bc.set_timestamp_id(new_timestamp)

@eel.expose
def set_cluster_id_1(new_cluster_id_1: str):
    return bc.set_cluster_id_1(new_cluster_id_1)

@eel.expose
def set_cluster_id_2(new_cluster_id_2: str):
    return bc.set_cluster_id_2(new_cluster_id_2)

@eel.expose
def set_new_column_name(new_column_name: str):
    return bc.set_new_column_name(new_column_name)

@eel.expose
def set_new_instructions(new_instructions: str):
    return bc.set_new_instructions(new_instructions)

@eel.expose
def set_new_default_val(new_default_val: str):
    return bc.set_new_default_val(new_default_val)

@eel.expose
def get_datatypes():
    return bc.get_dtypes()

@eel.expose
def get_eventlog():
    return bc.get_eventlog()

@eel.expose
def download_eventlog():
    bc.download_event_log()


@eel.expose
def get_dataset():
    return bc.get_data()

@eel.expose
def pick_file(wildcard="*"):
    print("pick_file")
    app = wx.App(None)
    style = wx.FD_OPEN | wx.FD_FILE_MUST_EXIST | wx.STAY_ON_TOP
    dialog = wx.FileDialog(None, 'Open', wildcard=wildcard, style=style)
    if dialog.ShowModal() == wx.ID_OK:
        path = dialog.GetPath()
    else:
        path = None
    dialog.Destroy()
    bc.set_path(path)
    return path

@eel.expose
def change_datatypes(changes):
    statuses = {}
    for change in changes:
        try:
            bc.set_dtype(change['name'], change['type'])
            statuses[change['name']] = "success"
        except:
            print("Error in changing datatype")
            statuses[change['name']] = "error"
    return statuses

@eel.expose
def visualize_inductive():
    return bc.visualize('inductive')
    

@eel.expose
def visualize_heuristic():
    return bc.visualize('heuristic')

@eel.expose
def get_model_stats():
    res = bc.model_statistics()
    print(res)
    return res


@eel.expose
def use_button(x):

    bc.convert_to_datetime("Timestamp")
    bc.set_dtype("Zmienna G", str)
    bc.make_event_log_and_visualize("net")

    if_instructions = [
        ("['Zmienna C'] > 50", "2 * ['Zmienna C']"),
        ("['Zmienna A'] > 160", "['Zmienna A'] - ['Zmienna C']"),
        # ("['Zmienna A'] > 0", "exit(0)") eval is UNSAFE if you use exit(0) in val the program will end
    ]
    bc.add_new_column("nowa kolumna", if_instructions, 0)
    print(bc.get_data())

    return "use_button success"

@eel.expose
def new_column():
    res = bc.add_new_column()
    print(res)
    return res


# Use latest version of Eel from parent directory
sys.path.insert(1, '../')

@eel.expose
def submit_csv_import(separator_value):
    # TODO skorzystać z wcześniej otrzymanego path
    separator = separator_value # TODO wyrzucić wybór separatora na frontend (None jest Defaultowy)
    bc.read_data(separator) 
    print("submit_csv_import")
    something = "success"
    return something


@eel.expose  # Expose function to JavaScript
def say_hello_py(x):
    """Print message from JavaScript on app initialization, then call a JS function."""
    print('Hello from %s' % x)  # noqa T001
    eel.say_hello_js('Python {from within say_hello_py()}!')


@eel.expose
def expand_user(folder):
    """Return the full path to display in the UI."""
    return '{}/*'.format(os.path.expanduser(folder))


@eel.expose
def set_data_type(column_name: str):
    bc.set_dtype(column_name, str)
    return bc.get_data()


@eel.expose
def visualize(file_path: str):
    return bc.make_event_log_and_visualize(file_path)


@eel.expose
def add_column(column_name: str, cond_instructions, statement_instructions, default_value:object):
    """
    cond_instruction - lista warunków w ifie np. [ "['Zmienna C'] > 50", "['Zmienna A'] > 160"] ]
    statement_instructions - lista wartości jesli if powyżej jest prawdziwy np. [1, 2]

    """
    bc.add_new_column(column_name, list(zip(cond_instructions, statement_instructions)), default_value)
    return


def start_eel(develop):
    """Start Eel with either production or development configuration."""

    if develop:
        directory = 'src'
        # app = None
        page = {'port': 3000}
    else:
        directory = 'build'
        # app = 'chrome-app'
        page = 'index.html'

    eel.init(directory, ['.jsx', '.js', '.html', '.css'])

    # These will be queued until the first connection is made, but won't be repeated on a page reload
    # say_hello_py('Python World!' + str(page))
    # eel.say_hello_js('Python World!')   # Call a JavaScript function (must be after `eel.init()`)

    # eel.show_log('https://github.com/samuelhwilliams/Eel/issues/363 (show_log)')

    eel_kwargs = dict(
        host='localhost',
        port=8080,
        size=(1280, 800),
    )


    app = bottle.Bottle()

    @app.route("/gfx/<filepath:path>")
    def static(filepath):
        return bottle.static_file(filepath, root="gfx")
    

    try:
        if develop:
            eel.start(page,app=app,  **eel_kwargs)
        else:
            eel.start(page, default_path="/", app=app, **eel_kwargs)

    except EnvironmentError:
        # If Chrome isn't found, fallback to Microsoft Edge on Win10 or greater
        if sys.platform in ['win32', 'win64'] and int(platform.release()) >= 10:
            eel.start(page, mode='edge', app=app, **eel_kwargs)
        else:
            raise


if __name__ == '__main__':
    import sys
    
    # Pass any second argument to enable debugging
    start_eel(develop=len(sys.argv) == 2)
