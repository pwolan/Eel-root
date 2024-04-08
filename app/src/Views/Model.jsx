import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eel } from "../App";
import Button from "../Components/Button";
const Model = () => {
    const [visualizationPath, setVisualizationPath] = useState(null)
    const [isButtonActive, setIsButtonActive] = useState(false);
    const navigator = useNavigate();
    useEffect(() => {

    }, []);


    const handleGoToEventLog = async () => {
        return navigator("/eventlog")
    }

    const handleShowVisualizationInductive = async () => {
        const path = await eel.visualize_inductive()() // returns path to .png file
        setVisualizationPath(path)
        setIsButtonActive(true)
        console.log(path)
    }
    const handleShowVisualizationHeuristic = async () => {
        const path = await eel.visualize_heuristic()() // returns path to .png file
        setVisualizationPath(path)
        setIsButtonActive(true)
        console.log(path)
    }
    const handleShowStats = async () => {
        eel.get_model_stats()  // returns statistics
    }

    return (
        <div className="p-10">
            <div>
                <Button onClick={handleGoToEventLog} className=" !w-24 ">Powrót</Button>
            </div>
            <div className="py-10 flex flex-col items-center">
                <Button onClick={handleShowVisualizationInductive}>Algorytm Inductive Miner</Button>
                <Button onClick={handleShowVisualizationHeuristic}>Algorytm Heuristic Miner</Button>
                <Button onClick={handleShowStats} disabled={!isButtonActive}>Wyświetl statystyki</Button>
            </div>
            <div>
                {visualizationPath}
                {/* {visualizationPath && <img src={`%PUBLIC_URL%/${visualizationPath}`} alt="visualization" />} */}
                {visualizationPath && <img src={`/image.png`} alt="visualization" />}
            </div>
        </div>
    )
}

export default Model;