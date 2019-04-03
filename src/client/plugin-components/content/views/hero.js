import React from 'react';

export default function register({parse} = injections) {

  return function Hero(props) {
    const Image = parse(props.content.image);
    return (
      <div className={'hero'}>
        <Image />
      </div>
    );
  }

}