import React, { useEffect, useState } from "react";
import { eel } from "../App";
import { useRecoilState } from "recoil";
import { are_stats_loading } from "../state/atoms";

const Stats = ({path}) => {
    const [stats, setStats] = useState(null)
    const [areStatsLoading, setAreStatsLoading] = useRecoilState(are_stats_loading)
    
    useEffect(() => {
        if(path === null) return
        setAreStatsLoading(true)
        setTimeout(()=>{
            eel.get_model_stats()().then((stats) => {
                setAreStatsLoading(false)
                setStats(stats)
            })
        }, 1000)
    
    },[path]);
    return (
        <div>
            {areStatsLoading && <div>Wczytywanie statystyk...</div>}
            {stats && areStatsLoading === false && (
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