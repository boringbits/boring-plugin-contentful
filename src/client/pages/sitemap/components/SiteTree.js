import React from 'react';
import {isNode, NoSsr} from 'boringbits/client';
import uuid from 'uuid/v4';


const Tree = isNode? () => <></> : require('react-d3-tree').Tree;

class NodeLabel extends React.PureComponent {

  render() {
    const {nodeData} = this.props
    function click(event) {
      console.log(nodeData);
      // event.stopPropagation();
      // event.preventDefault();
    }
    return (
      <div style={{width: (this.props.nodeWidth * 2) + 'px', height: (this.props.nodeHeight + 30) +'px'}} onClick={click}>
        <h6>{nodeData.name}</h6>
      </div>
    )
  }
}

function mapContent(item) {
  return {
    ...item.content,
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
        width: 80,
        height: 90,
      },
      page: {
        width: 1600,
        height: 1000,
      },
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
      nodeSvgShape,
      styles,
      dims
    });
  }


  render() {

    return (
      <div id="treeWrapper" style={{width: this.state.dims.page.width + 'px', height: this.state.dims.page.height + 'px'}}>
        <NoSsr>
          <Tree data={this.state.tree}
            styles={this.state.styles}
            nodeSvgShape={this.state.nodeSvgShape}
            orientation={'vertical'}
            translate={{x: (this.state.dims.page.width/2), y: 100}}
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
                y: -65,
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
