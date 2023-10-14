import React from "react"

export default function Button({ children, onClick }){
    // console.log(onClick)
    return(
        <button onClick={onClick}>{children}</button>
    )
}