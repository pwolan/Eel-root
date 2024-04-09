import React, {useState} from "react";
import Dropzone from "../Components/Dropzone";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import { accepted_file } from "../state/atoms";

import { eel } from "../App";
import { useRecoilValue } from "recoil";
import Select from "react-select";

const Upload = () => {
    const [delimiter, setDelimiter] = useState(null)
    const navigate = useNavigate()
    const acceptedFile = useRecoilValue(accepted_file)
    const handleSubmit = async () => {
        console.log(delimiter)
        const response = await eel.submit_csv_import(delimiter)()
        return navigate('/dataset')

    }


    return (
        <div className="container mx-auto flex flex-col items-center justify-center w-full  h-screen">
            <div className="w-full flex flex-col items-center">
                <h1 className='text-center text-3xl my-4'> Wczytaj plik csv </h1>
                <Dropzone />
                <Select 
                    className="mb-4 w-64"
                    options={[
                        {value: null, label: 'Wykryj'},
                        {value: ',', label: 'Przecinek'},
                        {value: ';', label: 'Średnik'},
                        {value: '\t', label: 'Tabulator'},
                        {value: '.', label: 'Kropka'},
                    ]}
                    onChange={(e) => setDelimiter(e.value)}
                    defaultValue={{value: null, label: 'Wykryj'}}
                />
                <Button onClick={handleSubmit} disabled={acceptedFile === null} >Zatwierdź</Button>
            </div>
        </div>)
}

export default Upload;