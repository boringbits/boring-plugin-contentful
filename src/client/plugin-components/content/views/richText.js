import React from 'react';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';


export default function register({parse} = injections) {

  @withStyles({
    container: {
      width: '100%'
    }
  })
  @connect((state) => ({
    contentfulObjects: state.contentful
  }), null)
  class RichText extends React.Component {

    constructor(...args) {
      super(...args);
      const parseNode = this.parseNode.bind(this);

      this.docToReactOptions = {
        renderNode: {
          [BLOCKS.EMBEDDED_ENTRY]: parseNode,
          [BLOCKS.EMBEDDED_ASSET]: parseNode,
          [INLINES.EMBEDDED_ENTRY]: parseNode
        }
      };
    }

    parseNode(node) {
      const ComponentObj = this.props.contentfulObjects[node.data.target.sys.id];
      const Component = parse(ComponentObj);
      return <Component />;
    }

    render() {
      return <div className={this.props.classes.container}>
        {documentToReactComponents(this.props, this.docToReactOptions)}
        </div>;
    }
  }

  return RichText;

};
