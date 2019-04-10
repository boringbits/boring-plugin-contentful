import React from 'react'


export default function NodeName(props) {

  return (
    <h6 style={{width: props.nodeWidth + 'px'}}>{props.name}</h6>
  )
}