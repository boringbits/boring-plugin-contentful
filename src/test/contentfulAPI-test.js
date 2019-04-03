const assert = require('assert');
const contentful = require('contentful');


function createApi(getEntriesFn) {

  jest.mock('contentful', () => {

    return {
      createClient: (config) => {

        const realClient = contentful.createClient(config);
        return {
          getEntries: getEntriesFn,
          parseEntries: realClient.parseEntries
        };
      }
    }
  })

  const contentfulApi = require('../managed_modules/contentful');

  let Api;

  const configObj = {
    'clients.contentful.accessToken': 'bar',
    'clients.contentful.space': 'bar',
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

  contentfulApi(injections);
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

