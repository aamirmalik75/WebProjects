import React from 'react'

export default function Alert(props) {

    return (
        <div style={{height:'40px'}}>
            {props.alert && <div className={`alert ${props.alert.type}`}>
                <p><strong>{props.alert.type}</strong>:<span>{props.alert.message}</span></p>
            </div>}
        </div>
    )
}
