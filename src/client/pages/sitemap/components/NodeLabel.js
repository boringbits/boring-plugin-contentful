import React, {useState} from 'react';
import icon from './icon.png';
import iconEmpty from './icon-empty.png'

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
    opacity: .5,
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
      {/* <a href={manageLink} onClick={manageClick}>manage</a> */}
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