import React, {useState} from 'react';

export default function NodeLabel(props) {

  const [hovering, setHover] = useState(false);

  const {
    nodeData,
    textPaddingTop,
    expanderSize,
  } = props;

  const style = {
    marginLeft: (expanderSize /2) +'px',
    width: (props.nodeWidth * 2) + 'px',
    height: (props.nodeHeight + textPaddingTop) +'px',
    //backgroundColor: 'red',
  }

  const expandStyle = {
    width: expanderSize+'px',
    height: expanderSize+'px',
    lineHeight: ((expanderSize/2) + 5 ) + 'px',
    left:  (expanderSize /2)+ ((props.nodeWidth - expanderSize) / 2) + 'px',
    backgroundColor: '#5c6bc0',
  };

  const moveLeftStyle = {
    width: expanderSize+'px',
    height: expanderSize+'px',
    lineHeight: ((expanderSize/2) + 5 ) + 'px',
    bottom: (props.nodeHeight/2) + 'px',
    left: '0px',
    backgroundColor: '#5c6bc0',
  }

  const moveRightStyle = {
    width: expanderSize+'px',
    height: expanderSize+'px',
    lineHeight: ((expanderSize/2) + 5 ) + 'px',
    bottom: (props.nodeHeight/2) + 'px',
    left:  (expanderSize /2)+ (props.nodeWidth - (expanderSize/2))  + 'px',
    backgroundColor: '#5c6bc0',
  }

  const space = window.app_vars.config.contentful.space;
  const environment = window.app_vars.config.contentful.environment;

  const manageLink = `https://app.contentful.com/spaces/${space}/environments/${environment}/entries/${nodeData.contentful_id}`;
  const pageUrl = (nodeData.url) ? nodeData.url : null;

  function maskClick(event) {
    if (event.expand) return;
    event.stopPropagation();
    event.preventDefault();
  }

  function manageClick(event) {
    window.open(manageLink,'_meow');
    event.stopPropagation();
    event.preventDefault();
  }

  function pageClick(event) {
    window.open(pageUrl,'_meow');
    event.stopPropagation();
    event.preventDefault();
  }

  function expandClick(event) {
    event.expand = true;
  }

  function over(event) {
    setHover(true);
  }

  function out(event) {
    setHover(false);
  }

  function moveLeft() {
    if (props.moveLeft) props.moveLeft(nodeData);
  }
  function moveRight() {
    if (props.moveRight) props.moveRight(nodeData);
  }

  return (
    <div style={style} onClick={maskClick} className={'nodeMask ' + ((hovering) ? 'hovering' : 'nothovering')} onMouseOver={over} onMouseOut={out}>
      <h6>{nodeData.name}</h6>
      <a href={manageLink} onClick={manageClick}>manage</a>
        { (pageUrl) ? <a href={pageUrl} onClick={pageClick}>page</a>: <></> }
        { (nodeData._children && nodeData._children.length>0) ?
          <div style={expandStyle} className={'charButton'} onClick={expandClick}>
            {nodeData._collapsed ? '+' : '-'}
          </div>
          : <></>
        }

        {nodeData.child_pos > 0 ? <div style={moveLeftStyle} className={'position charButton'} onClick={moveLeft}>&lt;</div> : <></>}
        {nodeData.child_pos < (nodeData.children_length-1) ? <div style={moveRightStyle} className={'position charButton'} onClick={moveRight}>&gt;</div> : <></>}

    </div>
  )

}