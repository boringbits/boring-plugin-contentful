const assert = require('assert');


function init(options = {entries: {}, getPage: {}}) {
  return {
    injecture: {
      get: () => {
        return {
          getEntries: () => {
            return options.entries
          }
        }
      }
    },
    decorators: {
      router: {
        router: param => target => target,
        reactEntry: param => target => target,
        get: param => (target, name, desc) => desc
      },
    },
    boring: {
      beforeSync: () => {}
    }
  }
}

describe('router tests', function() {


  it('will install a router for content APIs', async () => {
    const router = require('../routers/contentfulRouter');

    const injections = init();

    assert.ok(router);
    router(injections);
  });
});