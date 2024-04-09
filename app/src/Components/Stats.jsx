import React, { useEffect, useState } from "react";
import { eel } from "../App";

const Stats = ({path}) => {
    const [stats, setStats] = useState(null)
    useEffect(() => {
        if(path === null) return
        eel.get_model_stats()().then((stats) => {
            console.log(stats)
            setStats(stats)
        })
    },[path]);
    return (
        <div>
            {stats && (
                <div className="flex items-center justify-center pb-8 flex-wrap">
                   {Object.keys(stats).map((key) => (
                          <div key={key} className="p-2 font-semibold">
                            <span>{key}:&nbsp;</span>
                            <span>{stats[key]}</span>
                          </div>
                   ))}
                </div>
            
            )}
        </div>
    );
}

export default Stats;