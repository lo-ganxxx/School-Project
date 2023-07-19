import React from 'react'
import numeral from 'numeral'

export function DisplayCount(props) {
    //numeral format is used to make the numbers more readable, e.g. rather than 10384563, display 10m (in the case of using 0a)
    return <span className={props.className}>{numeral(props.children).format("0a")}</span> //props.children displays whatever is included between the opening and closing tags when invoking the component
}