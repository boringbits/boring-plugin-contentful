/* eslint-disable */
import React from 'react';
import { getComponents } from 'boringbits/react';
import {Helmet} from 'boringbits/client';
import {connect} from 'react-redux';
import SiteTree from '../components/SiteTree';
import fetch from 'cross-fetch';

const {decorators} = getComponents();
const {
  withStyles,
  withContent
} = decorators

@withContent
@connect(
  state => ({
    sitemap: state.sitemap,
  })
)
@withStyles(theme => ({
  container: {
    width: '100%',
    height: '100%'
  },
}))
class SiteMap extends React.Component {

  static path = '*';

  swap(node) {
    console.log(this.props.sitemap.root)
    console.log(node);

    fetch('/content/setChildren', {
      method: 'POST',
      body: JSON.stringify(mapNode(node)),
      headers: {'Content-Type': 'application/json; charset=utf-8'},
    }).then(resp => resp.json())
      .then(resp => {
        console.log(resp);
      })
  }

  render() {

    const classes = this.props.classes;
    const RootNode = this.props.contentComponents.makeComponent('sitemapNode');

    return (
      <>
        <Helmet>
          <link rel="stylesheet" href="//stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"></link>

          <script src="//code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
          <script src="//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossOrigin="anonymous"></script>
          <script src="//stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossOrigin="anonymous"></script>

         </Helmet>
         <div className={'container-fluid ' + classes.container}>
           {/* <RootNode {...this.props.sitemap.root} /> */}
            <SiteTree sitemap={this.props.sitemap.root} swap={this.swap.bind(this)} />
         </div>
      </>
    )
  }
}

function mapNode(node) {
  return {
    id: node.contentful_id,
    name: node.name,
    children: (node.children) ? node.children.map(mapNode) : [],
  }
}

export default SiteMap;