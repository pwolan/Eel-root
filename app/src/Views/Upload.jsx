import React from "react";
import Dropzone from "../Components/Dropzone";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import { accepted_file } from "../state/atoms";

import { eel } from "../App";
import { useRecoilValue } from "recoil";
const Upload = () => {
    const navigate = useNavigate()
    const acceptedFile = useRecoilValue(accepted_file)
    const handleSubmit = async () => {

        const response = await eel.submit_csv_import()()
        return navigate('/dataset')

    }


    return (
        <div className="container mx-auto flex flex-col items-center justify-center w-full  h-screen">
            <div className="w-full flex flex-col items-center">
                <h1 className='text-center text-3xl my-4'> Wczytaj plik csv </h1>
                <Dropzone />
                <Button onClick={handleSubmit} disabled={acceptedFile === null} >Zatwierdź</Button>
            </div>
        </div>)
}

export default Upload;