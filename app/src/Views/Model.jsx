import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eel } from "../App";
import Button from "../Components/Button";
const Model = () => {
    const [data, setData] = useState([]);
    const [schema, setSchema] = useState(null);
    const navigator = useNavigate();
    useEffect(() => {
            setData("ok");
            setSchema("ok");
    }, []);


    const handleGoToEventLog = async () => {
        return navigator("/eventlog")
    }

    const handleShowVisualizationInductive = async () => {
        eel.visualize_inductive('petri_') // returns path to .png file
    }
    const handleShowVisualizationHeuristic = async () => {
        eel.visualize_heuristic('petri_') // returns path to .png file
    }
    const handleShowStats = async () => {
        eel.get_model_stats()  // returns statistics
    }
    // TO DO button handleShowStats should be inactive before one of the algorithms is run

        return (
        <div className="p-10">
            <div className="py-10 flex flex-col items-center">
                <Button onClick={handleShowVisualizationInductive}>Algorytm Inductive Miner</Button>
                <Button onClick={handleShowVisualizationHeuristic}>Algorytm Heuristic Miner</Button>
                <Button onClick={handleShowStats}>Wyświetl statystyki</Button>
                <Button onClick={handleGoToEventLog}>Powrót</Button>
            </div>
        </div>
    )
}

export default Model;