"""Main Python application file for the EEL-CRA demo."""

import os
import platform
import random
import sys

import wx
import eel

from backend.new_columns import new_column
from backend.event_log import make_event_log
import backend.index as bc

@eel.expose
def pick_file(wildcard="*"):
    print("pick_file")
    app = wx.App(None)
    style = wx.FD_OPEN | wx.FD_FILE_MUST_EXIST
    dialog = wx.FileDialog(None, 'Open', wildcard=wildcard, style=style)
    if dialog.ShowModal() == wx.ID_OK:
        path = dialog.GetPath()
    else:
        path = None
    dialog.Destroy()
    bc.read_path(path)
    # TODO zapisać path, żeby potem go użyć w submit_csv_import
    # zrobione
    return path

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
def delete_duplicates_button():
    bc.delete_records()
    return bc.get_data()

# Use latest version of Eel from parent directory
sys.path.insert(1, './')

@eel.expose
def submit_csv_import():
    # TODO skorzystać z wcześniej otrzymanego path
    bc.read_data()
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


# @eel.expose
# def pick_file(folder):
#     """Return a random file from the specified folder."""
#     folder = os.path.expanduser(folder)
#     if os.path.isdir(folder):
#         listFiles = [_f for _f in os.listdir(folder) if not os.path.isdir(os.path.join(folder, _f))]
#         if len(listFiles) == 0:
#             return 'No Files found in {}'.format(folder)
#         return random.choice(listFiles)
#     else:
#         return '{} is not a valid folder'.format(folder)


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

    eel.init(directory, ['.tsx', '.ts', '.jsx', '.js', '.html'])

    # These will be queued until the first connection is made, but won't be repeated on a page reload
    # say_hello_py('Python World!' + str(page))
    # eel.say_hello_js('Python World!')   # Call a JavaScript function (must be after `eel.init()`)

    # eel.show_log('https://github.com/samuelhwilliams/Eel/issues/363 (show_log)')

    eel_kwargs = dict(
        host='localhost',
        port=8080,
        size=(1280, 800),
    )
    try:
        eel.start(page, **eel_kwargs)

    except EnvironmentError:
        # If Chrome isn't found, fallback to Microsoft Edge on Win10 or greater
        if sys.platform in ['win32', 'win64'] and int(platform.release()) >= 10:
            eel.start(page, mode='edge', **eel_kwargs)
        else:
            raise


if __name__ == '__main__':
    import sys
    
    # Pass any second argument to enable debugging
    start_eel(develop=len(sys.argv) == 2)
