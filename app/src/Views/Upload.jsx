import React from "react";
import Dropzone from "../Components/Dropzone";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";

import { eel } from "../App";
const Upload = () => {
    const navigate = useNavigate()
    const handleSubmit = async () => {
        const response = await eel.submit_csv_import()()
        console.log(response)
        return navigate('/dataset')

    }

    const [isSubmitable, setIsSubmitable] = React.useState(false)
    return (
        <div className="w-full flex flex-col items-center">
            <h1 className='text-center text-3xl my-4'> Wczytaj plik csv </h1>
            <Dropzone setIsSubmitable={setIsSubmitable} />
            <Button onClick={handleSubmit} disabled={!isSubmitable} >Zatwierdź</Button>
        </div>)
}

export default Upload;