import React from "react"
import "./Button.css"

export default function Button({ children, onClick }){
    return(
        <button className="btn" onClick={onClick}>
            {children}
        </button>
    )
}