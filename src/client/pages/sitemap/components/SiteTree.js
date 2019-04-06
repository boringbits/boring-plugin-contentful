import React from 'react';
import {isNode, NoSsr} from 'boringbits/client';
import uuid from 'uuid/v4';
import './SiteTree.css';

const Tree = isNode? () => <></> : require('react-d3-tree').Tree;
const textPaddingTop = 20;

function NodeLabel(props) {

  const style = {
    width: (props.nodeWidth * 2) + 'px',
    height: (props.nodeHeight + textPaddingTop) +'px',
   // backgroundColor: 'red',
  }
  const {nodeData} = props;
  const space = window.app_vars.config.contentful.space;
  const environment = window.app_vars.config.contentful.environment;

  const manageLink = `https://app.contentful.com/spaces/${space}/environments/${environment}/entries/${nodeData.contentful_id}`;
  const pageUrl = (nodeData.url) ? nodeData.url : null;

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

  return (
    <div style={style} className={'nodeMask'}>
      <h6>{nodeData.name}</h6>
      <a href={manageLink} onClick={manageClick}>manage</a>
      { (pageUrl) ?
        <a href={pageUrl} onClick={pageClick}>page</a>
        : <></>
      }
    </div>
  )

}

function mapContent(item) {
  return {
    ...item.content,
    contentful_id: item.id,
    name: (item.content.name || item.content.title),
    children: ((item.content.children && item.content.children.length>0) ? item.content.children.map(child => {
      return mapContent(child);
    }) : [])
  }
}

class SiteTree extends React.Component {

  componentWillMount() {

    const dims = {
      node: {
        width: 100,
        height: 90,
      }
    };

    const nodeSvgShape = {
      shape: 'rect',
      shapeProps: {
        width: dims.node.width,
        height: dims.node.height,
        x:  ((dims.node.width / 2) * -1),
        y: ((dims.node.height / 2) * -1),
      }
    }

    const styles = {
      nodes: {
        node: {
          circle: {
            fill: '#26418f',
          },
          name: {},
          attributes: {},
        },
        leafNode: {
          circle: {
            fill: '#8e99f3',
          },
          name: {},
          attributes: {},
        },
      },
    }

    this.setState({
      tree: [mapContent(this.props.sitemap)],
      translate: {x: 0, y: 100},
      nodeSvgShape,
      styles,
      dims
    });
  }

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 100,
      }
    });
  }

  render() {

    return (
      <div id="treeWrapper"
        style={{width: '100%', height: '1000px'}}
        ref={tc => (this.treeContainer = tc)}>
        <NoSsr>
          <Tree data={this.state.tree}
            styles={this.state.styles}
            nodeSvgShape={this.state.nodeSvgShape}
            orientation={'vertical'}
            translate={this.state.translate}
            separation={{
              siblings: 1.5,
              nonSiblings: 2
            }}
            initialDepth={1}
            collapsible={true}
            pathFunc={'elbow'}
            allowForeignObjects={true}
            zoomable={true}
            shouldCollapseNeighborNodes={false}
            nodeLabelComponent={{
              render: <NodeLabel nodeWidth={this.state.dims.node.width} nodeHeight={this.state.dims.node.height} />,
              foreignObjectWrapper: {
                y: (((this.state.dims.node.height / 2) * -1) - textPaddingTop),
                x: ((this.state.dims.node.width / 2) * -1),
                width: (this.state.dims.node.width * 2)
              }
            }}
          />
        </NoSsr>
      </div>
    );
  }
}

export default SiteTree;










function addId(obj) {
  if (obj instanceof Array) {
    return obj.map(item => {
      return addId(item);
    })
  } else {
    const ret = {};
    obj._id = uuid();
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object') {
          ret[prop] = addId(obj[prop]);
        }
        else {
          ret[prop] = obj[prop];
        }
      }
    }
    return ret;
  }
}

function splice(obj, item) {
  if (obj instanceof Array) {
    for (let i=0; i<obj.length; i++) {
      obj[i] = splice(obj[i], item);
    }
    return obj;
  } else {
    if (obj._id === item._id) {
      obj._collapsed = item._collapsed;
      // console.log('####', obj);
      return obj;
    }
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object') {
          obj[prop] = splice(obj[prop], item);
        }
      }
    }
    return obj;
  }
}
