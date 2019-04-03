import React from 'react';

export default function register(injections) {

  return function Asset(props) {
    return <img src={props.content.file.url} />
  }

}