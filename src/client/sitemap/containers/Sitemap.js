/* eslint-disable */
import React from 'react';
import { getComponents } from 'boringbits/react';

const {decorators} = getComponents();
const {
  withStyles,
} = decorators

@withStyles(theme => ({
  container: {
    margin: '30px',
    width: '100%',
  },
}))
class SiteMap extends React.Component {

  static path = '*';

  render() {

    const classes = this.props.classes;
    return (
      <>test123 abc sitemap</>
    )
  }
}

export default SiteMap;