import React, {useState} from 'react';
import icon from './icon.png';
import iconEmpty from './icon-empty.png'
import NodeName from './NodeName';

export default function NodeLabel(props) {

  const [hovering, setHover] = useState(false);

  const {
    nodeData,
    labelYOffset,
    iconBtnSize,
  } = props;

  const pageUrl = (nodeData.url) ? nodeData.url : null;
  const pageIconWidth = props.pageIconWidth || 25;
  const pageIconHeight = props.pageIconHeight || 35;
  const space = window.app_vars.config.contentful.space;
  const environment = window.app_vars.config.contentful.environment;
  const manageLink = `https://app.contentful.com/spaces/${space}/environments/${environment}/entries/${nodeData.contentful_id}`;

  const style = {
    marginLeft: (iconBtnSize /2) +'px',
    width: (props.nodeWidth * 2) + 'px',
    height: (props.nodeHeight + labelYOffset) +'px',
    //backgroundColor: 'red',
  }


  const expandStyle = {
    width: iconBtnSize+'px',
    height: iconBtnSize+'px',
    lineHeight: ((iconBtnSize/2) + 5 ) + 'px',
    left:  (iconBtnSize /2)+ ((props.nodeWidth - iconBtnSize) / 2) + 'px',
    backgroundColor: '#5c6bc0',
  };

  const moveLeftStyle = {
    width: iconBtnSize+'px',
    height: iconBtnSize+'px',
    lineHeight: ((iconBtnSize/2) + 5 ) + 'px',
    bottom: (props.nodeHeight/2) + 'px',
    left: '0px',
    backgroundColor: '#5c6bc0',
  }

  const moveRightStyle = {
    width: iconBtnSize+'px',
    height: iconBtnSize+'px',
    lineHeight: ((iconBtnSize/2) + 5 ) + 'px',
    bottom: (props.nodeHeight/2) + 'px',
    left:  (iconBtnSize /2)+ (props.nodeWidth - (iconBtnSize/2))  + 'px',
    backgroundColor: '#5c6bc0',
  }


  const pageStyle = {
    backgroundImage: `url(${pageUrl ? icon: iconEmpty})`,
    opacity: (pageUrl ? 1 : .5),
    width: pageIconWidth+ 'px',
    height: pageIconHeight+ 'px',
    display: 'block',
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${pageIconWidth}px ${pageIconHeight}px`,
    position: 'absolute',
    top: ((labelYOffset) + (props.nodeHeight / 2) - (pageIconHeight/2)) + 'px',
    left: ((iconBtnSize /2) + (props.nodeWidth / 2) - (pageIconWidth/2)) + 'px',
  };


  function maskClick(event) {
    if (event.expand) return;
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

  function moveLeft(event) {
    if (props.moveLeft) props.moveLeft(nodeData);
    event.stopPropagation();
    event.preventDefault();
  }
  function moveRight(event) {
    if (props.moveRight) props.moveRight(nodeData);
    event.stopPropagation();
    event.preventDefault();
  }

  function dragNode(event) {
    console.log('Drag', event);
  }

  return (
    <div draggable={true}
      style={style}
      onClick={maskClick}
      onDragStart={dragNode}
      className={'nodeMask ' + ((hovering) ? 'hovering' : 'nothovering')}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}>
      <NodeName nodeWidth={props.nodeWidth} name={nodeData.name}></NodeName>
      <a href={pageUrl} onClick={pageClick} style={pageStyle}></a>
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