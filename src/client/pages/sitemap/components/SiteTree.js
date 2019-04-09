import React, {useState} from 'react';
import {isNode, NoSsr} from 'boringbits/client';
import uuid from 'uuid/v4';
import NodeLabel from './NodeLabel';
import './SiteTree.css';


const Tree = isNode? () => <></> : require('react-d3-tree').Tree;
const textPaddingTop = 20;
const expanderSize = 25;


function mapContent(item) {
  let childPos = 0;
  return {
    ...item.content,
    contentful_id: item.id,
    name: (item.content.name || item.content.title),
    children: ((item.content.children && item.content.children.length>0) ? item.content.children.map(child => {
      return {
        ...mapContent(child),
        child_pos: childPos++,
        children_length: item.content.children.length
      }
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

  swap(nodeA, nodeB) {

    const {
      child_pos,
      contentful_id
    } = nodeB;

    const tree = this.state.tree;
    const parent = nodeA.parent;
    const temp = {
      ...nodeB
    };

    nodeB.contentful_id = nodeA.contentful_id;
    nodeB.name = nodeA.name;
    nodeB._children = nodeA._children;

    nodeA.contentful_id = temp.contentful_id;
    nodeA.name = temp.name;
    nodeA._children = temp._children;

    this.setState({
      tree
    });
  }

  moveLeft(node) {
    const {
      child_pos,
    } = node;

    this.swap(node.parent.children[child_pos-1], node);
  }

  moveRight(node) {
    const {
      child_pos,
    } = node;

    this.swap(node, node.parent.children[child_pos+1]);

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
              render: <NodeLabel
                moveLeft={this.moveLeft.bind(this)}
                moveRight={this.moveRight.bind(this)}
                expanderSize={expanderSize}
                textPaddingTop={textPaddingTop}
                nodeWidth={this.state.dims.node.width}
                nodeHeight={this.state.dims.node.height} />,
              foreignObjectWrapper: {
                y: (((this.state.dims.node.height / 2) * -1) - textPaddingTop),
                x: ((this.state.dims.node.width / 2) * -1) - (expanderSize/2),
                width: (this.state.dims.node.width * 2) + (expanderSize/2),
                height: (this.state.dims.node.height + textPaddingTop + (expanderSize/2))
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
