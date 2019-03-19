const assert = require('assert');
const contentful = require('contentful');


jest.mock('contentful', () => {
  return {
    createClient: (config) => {
      const realClient = contentful.createClient(config);
      return {
        getEntries: config.getEntries,
        parseEntries: realClient.parseEntries
      };
    }
  }
})

function createApi(getEntriesFn) {
  const contentful = require('../managed_modules/contentful');

  let Api;

  const configObj = {
    'clients.contentful': { 'accessToken': 'bar', 'space': 'bee', getEntries: 'bar' },
    'clients.contentful.accessToken': 'bar',
    'clients.contentful.space': 'bar',
    // this is kinda a hacky to pass this function into the
    // global mocked version of contentful
    'clients.contentful.getEntries': getEntriesFn
  };

  const injections = {
    decorators: {
      injecture: {
        registerSingleton: target => {
          Api = target;
          return target;
        }
      }
    },
    config: { get: (key) => configObj[key] }
  }

  contentful(injections);
  return new Api();
}

describe('ContentfulAPI', function() {

  it('will create an API and register it into injecture', async () => {

    const api = createApi(function() {
      return {
        items: [],
        includes: {
          Entries: [],
          Assets: [],
        }
      }
    });
    assert.ok(api);
    const page = await api.getPage();
  });

});

