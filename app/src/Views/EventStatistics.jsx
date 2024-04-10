import React, { useEffect } from "react";
import { eel } from "../App";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";

const EventStatistics = () => {
    const navigator = useNavigate();
    const [stats, setStats] = React.useState(null);
    useEffect(() => {
        eel.get_eventlog_statistics()().then((ee) => {
            const d = JSON.parse(ee);
            console.log(d)
            setStats(d)
        })
    }, [])

    return (
        <div className="p-10">
            <div>
                <Button onClick={() => navigator("/eventlog")} className=" !w-24 ">Powrót</Button>
            </div>
            {stats === null ? (<div>wczytywanie...</div>) : (
                <div>
                    <div className="my-4">
                        <h2 className="text-lg text-center">Ilość spraw: {stats["Ilość spraw"]}</h2>
                    </div>
                    <div className="flex justify-center flex-wrap">
                        <div className="m-4">
                            <h2 className="text-lg">Długości spraw: </h2>
                            {Object.keys(stats["Długości spraw"]).map(key => (
                                <div>{key}: {stats["Długości spraw"][key]}</div>
                            ))}
                        </div>
                        <div className="m-4">
                            <h2 className="text-lg">Startowe Czynności: </h2>
                            {Object.keys(stats["Startowe czynności"]).map(key => (
                                <div>{key}: {stats["Startowe czynności"][key]}</div>
                            ))}
                        </div>
                        <div className="m-4">
                            <h2 className="text-lg">Końcowe Czynności:</h2>
                            {Object.keys(stats["Końcowe czynności"]).map(key => (
                                <div>{key}: {stats["Końcowe czynności"][key]}</div>
                            ))}
                        </div>
                    </div>
                    <div className="my-4 text-center">
                        <h2 className="text-lg ">Warianty:</h2>
                        {stats["Warianty"].map(([seq, quantity]) => (
                            <div>
                                {seq.map((el, index) => (
                                    <span>{`${el} ${index !== seq.length - 1 ? '->' : ''} `} </span>
                                ))}
                                <span className="ml-6 font-semibold">ilość wystąpień: {quantity}</span>
                            </div>
                        ))}
                    </div>

                </div>

            )}
        </div>
    );
}

export default EventStatistics;