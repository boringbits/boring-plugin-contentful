import React from 'react';
import {isNode, NoSsr, getComponents} from 'boringbits/client';
import NodeLabel from './NodeLabel';
import './SiteTree.css';
import { withTheme } from '@material-ui/core/styles';


const {decorators} = getComponents();
const {withStyles} = decorators;


const Tree = isNode? () => <></> : require('react-d3-tree').Tree;

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

@withStyles((theme) => ({

}))
@withTheme()
class SiteTree extends React.Component {

  componentWillMount() {

    const dims = this.props.dims;
    const theme = this.props.theme;

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
            fill: theme.palette.secondary.dark,
          },
          name: {},
          attributes: {},
        },
        leafNode: {
          circle: {
            fill: theme.palette.secondary.light,
          },
          name: {},
          attributes: {},
        },
      },
    }

    this.setState({
      width: this.props.dims.tree.width,
      translate: {
        x: (this.props.dims.tree.width / 2),
        y: 100,
      },
      tree: [mapContent(this.props.sitemap)],
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
      tree: this.state.tree,
    })
    if (this.props.swap) this.props.swap(parent);
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
              width={'99%'}
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
              zoomable={false}
              shouldCollapseNeighborNodes={false}
              nodeLabelComponent={{
                render: <NodeLabel
                  pageIconWidth={20}
                  pageIconHeight={25}
                  moveLeft={this.moveLeft.bind(this)}
                  moveRight={this.moveRight.bind(this)}
                  iconBtnSize={this.props.iconBtnSize}
                  labelYOffset={this.props.labelYOffset}
                  nodeWidth={this.state.dims.node.width}
                  nodeHeight={this.state.dims.node.height} />,
                foreignObjectWrapper: {
                  y: (((this.state.dims.node.height / 2) * -1) - this.props.labelYOffset),
                  x: ((this.state.dims.node.width / 2) * -1) - (this.props.iconBtnSize/2),
                  width: (this.state.dims.node.width * 2) + (this.props.iconBtnSize/2),
                  height: (this.state.dims.node.height + this.props.labelYOffset + (this.props.iconBtnSize/2))
                }
              }}
            />
          </NoSsr>
      </div>
    );
  }
}

SiteTree.defaultProps = {
  labelYOffset: 20,
  iconBtnSize: 25,
  dims: {
    tree: {
      width: 2000,
    },
    node: {
      width: 100,
      height: 90,
    }
  }
}

export default SiteTree;



