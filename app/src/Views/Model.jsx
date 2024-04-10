import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eel } from "../App";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Button from "../Components/Button";
import Controls from "../Components/Controls";
import Stats from "../Components/Stats";

const Model = () => {
    const [visualizationPath, setVisualizationPath] = useState(null)
    const [isVisualizationLoading, setIsVisualizationLoading] = useState(false)
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
        <div className="p-10 h-screen flex flex-col">
            <div>
                <Button onClick={handleGoToEventLog} className=" !w-24 ">Powrót</Button>
            </div>
            <div className="py-10 flex justify-center items-center">
                <Button onClick={handleShowVisualizationInductive}>Algorytm Inductive Miner</Button>
                <Button onClick={handleShowVisualizationHeuristic}>Algorytm Heuristic Miner</Button>
            </div>
            <Stats path={visualizationPath} />
            <div className="flex-1 flex flex-col">

                {isVisualizationLoading === true && (<div>wczytywanie...</div>)}
                {isVisualizationLoading === false && visualizationPath !== null && (
                    <TransformWrapper minScale={0.2} wheel={{ flex: 1 }}>
                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                            <>
                                <Controls />
                                <TransformComponent wrapperStyle={{ flex: 1 }}>
                                    <img src={`http://localhost:8080/gfx/${visualizationPath}`} className="object-contain" alt="visualization" />
                                </TransformComponent>
                            </>
                        )}

                    </TransformWrapper>
                )}
         
            </div>
        </div>
    )
}

export default Model;