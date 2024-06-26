import pandas as pd


def f(row, instructions, default_val):
    for cond, val in instructions:
        if eval(cond):
            return eval(val)
    return default_val


def find_bracket_contents(s):
    strings = []

    for i in range(len(s)):
        if s[i] == '[':
            j = s.find(']', i)
            strings.append(s[i+1:j])

    unique_strings = list(set(strings))

    return unique_strings


def new_column(df: pd.DataFrame, new_column_name: str, instructions, default_val=0):
    if new_column_name in df.columns:
        return "Kolumna o tej nazwie już istnieje", "error"

    # parse input
    for i in range(len(instructions)):
        instructions[i] = instructions[i][0].replace("[", "row["), instructions[i][1].replace("[", "row[")

    try:
        df[new_column_name] = df.apply(lambda row: f(row, instructions, default_val), axis=1)
    except Exception as e:
        return "Wystąpił błąd: " + str(e), "error"  
    finally:
        if new_column_name in df.columns:
            return "Dodawanie zakończone pomyślnie", "success"
        else:
            return "Wystąpił błąd", "error"
