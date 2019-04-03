import React from 'react';


export default function register({parse} = injections) {

  return function ComponentList(props = {items: []}) {

    const items = props.items || [];
    let itr = 0;
    return (
      <>
        {
          items.map(item => {
            const Component = parse(item);
            return <Component key={item.id || itr++} />
          })
        }
      </>
    )
  }

}