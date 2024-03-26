import pandas as pd
import pm4py
import eel

csv_data = """ID\tTimestamp\tZmienna A\tZmienna B\tZmienna C\tZmienna D\tZmienna E\tZmienna F\tZmienna G\tCase ID\tCluster
1\t01.01.2020 00:00\t176,8\t81,4\t60\t1\t88,09999847\t98,73999786\t0\t1\t2
2\t01.01.2020 00:10\t178,1\t72,6\t49\t1\t79,40000153\t95,26000214\t0\t1\t3
3\t01.01.2020 00:20\t152,1\t60,5\t34\t1\t79,40000153\t95,26000214\t0\t1\t10
4\t01.01.2020 00:30\t165,1\t72,6\t53\t1\t81,13999939\t95,26000214\t0\t1\t1
5\t01.01.2020 00:40\t176,8\t82,5\t58\t1\t79,40000153\t97\t0\t1\t4
6\t01.01.2020 00:50\t148,2\t60,5\t41\t1\t79,40000153\t95,26000214\t0\t1\t6
7\t01.01.2020 01:00\t128,7\t64,9\t46\t1\t75,91999817\t90,04000092\t0\t1\t8
8\t01.01.2020 01:10\t157,3\t64,9\t32\t1\t81,13999939\t93,51999664\t0\t1\t10
9\t01.01.2020 01:20\t179,4\t74,8\t57\t1\t86,36000061\t103,9599991\t0\t1\t10
10\t01.01.2020 01:30\t148,2\t60,5\t30\t1\t79,40000153\t97\t0\t1\t1
11\t01.01.2020 01:40\t175,5\t78,1\t61\t1\t98,54000092\t112,6600037\t0\t1\t8
12\t01.01.2020 01:50\t158,6\t60,5\t35\t1\t81,13999939\t95,26000214\t0\t1\t6
13\t01.01.2020 02:00\t175,5\t78,1\t61\t1\t93,31999969\t109,1800003\t0\t1\t3
14\t01.01.2020 02:10\t158,6\t60,5\t41\t1\t79,40000153\t95,26000214\t0\t1\t10
15\t01.01.2020 02:20\t115,7\t63,8\t53\t1\t72,44000244\t88,30000305\t0\t2\t1
16\t01.01.2020 02:30\t162,5\t70,4\t43\t1\t79,40000153\t97\t0\t2\t5
17\t01.01.2020 02:40\t183,3\t88\t59\t1\t98,54000092\t114,4000015\t0\t2\t4
18\t01.01.2020 02:50\t158,6\t68,2\t28\t1\t81,13999939\t95,26000214\t0\t2\t6
19\t01.01.2020 03:00\t167,7\t79,2\t69\t1\t82,87999725\t98,73999786\t0\t2\t2
20\t01.01.2020 03:10\t126,1\t64,9\t45\t1\t74,18000031\t91,77999878\t0\t2\t6
21\t01.01.2020 03:20\t143\t62,7\t50\t1\t75,91999817\t93,51999664\t0\t2\t10
22\t01.01.2020 03:30\t105,3\t63,8\t27\t1\t70,69999695\t84,81999969\t0\t2\t1
23\t01.01.2020 03:40\t97,5\t60,5\t28\t0\t68,95999908\t84,81999969\t1\t2\t2
24\t01.01.2020 03:50\t180,7\t79,2\t52\t1\t86,36000061\t103,9599991\t0\t2\t3
25\t01.01.2020 04:00\t180,7\t77\t67\t1\t88,09999847\t103,9599991\t0\t2\t8
26\t01.01.2020 04:10\t182\t84,7\t64\t1\t93,31999969\t112,6600037\t0\t2\t8
27\t01.01.2020 04:20\t152,1\t62,7\t31\t1\t81,13999939\t95,26000214\t0\t2\t4
28\t01.01.2020 04:30\t183,3\t78,1\t53\t1\t79,40000153\t95,26000214\t0\t2\t10
29\t01.01.2020 04:40\t169\t74,8\t60\t1\t100,2799988\t114,4000015\t0\t2\t4
30\t01.01.2020 04:50\t162,5\t70,4\t35\t1\t79,40000153\t97\t0\t2\t4"""

# Splitting the data by lines and then by tabs
data_rows = [row.split('\t') for row in csv_data.split('\n')]

# Extracting column names from the first row
columns = data_rows[0]

# Creating a DataFrame
global df
df = pd.DataFrame(data_rows[1:], columns=columns)


def make_event_log(name_cluster: str = "Cluster", name_caseid: str = "Case ID", name_timestamp: str = "Timestamp"):
    #TODO - delete duplicates (leave the last one) before taking selected columns [JK]
    global df
    # pm4py requires name_cluster and name_caseid to be of type string
    df[name_caseid] = df[name_caseid].astype(str)
    df[name_cluster] = df[name_cluster].astype(str)
    if name_timestamp == "": #TODO - make fake timestamps to stop pm4py potential crash
        selected_columns = df[[name_cluster, name_caseid]].copy()
        selected_columns = pm4py.format_dataframe(selected_columns, case_id_column=name_caseid, activity_column=name_cluster)
    else:
        selected_columns = df[[name_timestamp, name_cluster, name_caseid]].copy()
        formatted_columns = pm4py.format_dataframe(selected_columns, case_id=name_caseid, activity_key=name_cluster, timestamp_key=name_timestamp)
        net, im, fm = pm4py.discover_petri_net_alpha(selected_columns, activity_key=name_cluster, case_id_key=name_caseid, timestamp_key=name_timestamp)
        #pm4py.save_vis_petri_net(net, im, fm, 'petri_net.png')
        heu_net = pm4py.discover_heuristics_net(selected_columns, activity_key=name_cluster, case_id_key=name_caseid, timestamp_key=name_timestamp)
        #pm4py.save_vis_heuristics_net(heu_net, 'heu.png')
        log = pm4py.convert_to_event_log(formatted_columns)
    print(selected_columns.columns)
    print(log)
    