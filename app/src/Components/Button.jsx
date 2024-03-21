import React from 'react';

const classes = `
flex-none w-32 text-white bg-blue-700 hover:bg-blue-800
focus:ring-4 focus:ring-blue-300 font-medium rounded-lg 
text-sm px-5 py-2.5 me-2 mb-2 mx-2 dark:bg-blue-600 
dark:hover:bg-blue-700 focus:outline-none
dark:focus:ring-blue-800 disabled:opacity-50
`

const Button = ({disabled, onClick, children}) => {

    return <button type="button"
        disabled={disabled}
        onClick={onClick}
        className={classes}>
        {children}</button>

}

export default Button;