import pandas as pd


def f(row, instructions, default_val):
    #TODO - safe eval
    for cond, val in instructions:
        if eval(cond):
            return eval(val)
    return default_val


def new_column(df: pd.DataFrame, new_column_name: str, instructions, default_val=0):
    if new_column_name in df.columns:
        return "Kolumna o tej nazwie już istnieje"

    # parse input
    for i in range(len(instructions)):
        instructions[i] = instructions[i][0].replace("[", "row["), instructions[i][1].replace("[", "row[")


    try:
        df[new_column_name] = df.apply(lambda row: f(row, instructions, default_val), axis=1)
    except Exception as e:
        return "wystąpił błąd: " + str(e)
    finally:
        if new_column_name in df.columns:
            return "OK"
        else:
            return "Wystąpił błąd (być może podano kolumne która nie istnieje?)"
