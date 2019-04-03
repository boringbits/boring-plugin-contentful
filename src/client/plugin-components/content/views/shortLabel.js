import React from 'react';

export default function register({parse, components} = injections) {

  return function ShortLabel(props) {

    return (
      <span className={'shortLabel'}>
        {props.content.label}
      </span>
    );
  }

}