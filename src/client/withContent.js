import React from 'react';
import { getComponents } from 'boringbits/client';

function getContentViews() {
  const components = getComponents();
  if (components.context.contentViews) return components.context.contentViews;

  const views = components.contentViews || {};
  components.context.contentViews = Object.keys(views).reduce((acc, key) => {
    acc[key] = views[key](injections);
    return acc;
  }, {});

  return getContentViews();
}

function Empty(props) {
  return <></>
}

export function parse(obj, props={}) {
  const Component = makeComponent(obj.type);
  return function ComponentWrapper(wrapperProps) {
    return <Component {...obj} {...props} {...wrapperProps} />
  };
}

export function makeComponent(name) {
  const Component = components[name];
  if (!Component) return Empty;
  return Component;
}

const injections = {
  parse,
  makeComponent
}

class WithContent extends React.Component {

  render() {
    const {Target, propsForTarget} = this.props;
    const views = getContentViews();
    return (
      <>
        <Target {...propsForTarget} content={{
          views,
          ...injections
        }} />
      </>
    );
  }
}

export default WithContent;
