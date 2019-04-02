import React from 'react';
import './placeholder.css';


export default function register(injections) {

  return function Placeholder(props) {

    const {parse, makeComponent} = injections;
    const ComponentList = makeComponent('ComponentList');
    const RichText = makeComponent('richText');

    function nav() {
      if (props.content.link) window.location.href = props.content.link;
    }

    const style = {
      // override
      cursor: (props.content.link) ? 'pointer' : '',
      ...(props.content.style || {})
    };

    return (
      <div style={style} className={'placeholder '+(props.content.className || '')} onClick={(e) => nav()}>
        <div className={'name container-fluid'}>{props.content.name}</div>
        <div className={'body container-fluid ' + props.content.bodyClassName}>
          <div className={'copy container-fluid'}>
            <RichText {...props.content.copy} />
          </div>
          <div className={'components row ' + props.content.componentsClassName}>
            <ComponentList items={props.content.components} />
          </div>
        </div>
      </div>
    );
  }

}