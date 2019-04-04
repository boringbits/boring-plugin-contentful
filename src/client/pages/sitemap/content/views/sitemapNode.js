import React from 'react';

export default function register(injections) {

  return function SitemapNode(props) {

    const {parse, makeComponent} = injections;
    const children = props.content.children || [];
    return (
      <div className={'name container-fluid'}>
        {props.content.name}

        {
          children.map(child => {
            const Child = parse(child);
            return <Child {...child} key={child.id} />
          })
        }
      </div>
    );
  }

}