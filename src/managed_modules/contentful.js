import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import * as contentful from 'contentful';


let ran = false;
module.exports = function(BoringInjections) {
  if (ran) return;
  ran = true;

  const { decorators, config } = BoringInjections;
  const { registerSingleton } = decorators.injecture;

  let client;

  @registerSingleton
  class ContentfulAPI {

    getClient() {

      if (!client) {
        const contentfulArgs = ['space', 'accessToken', 'host', 'environment'].reduce((acc, key) => {
          const val = config.get('clients.contentful.'+ key);
          if (!val) return acc;

          acc[key] = val;
          return acc;
        }, {});
        client = contentful.createClient(contentfulArgs);
      }
      return client;
    }

    async getPage(path) {
      return this.getEntries('page', {'fields.url': path }, {parse: true});
    }

    async getEntries(content_type, query, options={ parse: true, include: 10 }) {
      const client = this.getClient();
      const entries = await client.getEntries({
        content_type,
        include: (options.include || 10),
        ...query
      });

      if (!options.parse) return entries;

      const parsedEntries = client.parseEntries(entries);

      const includes = entries.includes || [];
      const Entries = includes.Entry || [];
      const Assets = includes.Asset || [];

      return {
        items: parsedEntries.items.map(item => this.normalize(item)),
        includes: Entries.map(this.normalize.bind(this))
          .concat(Assets.map(this.normalize.bind(this)))
          .reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {})
      };
    }

    normalize(item) {

      if (item instanceof Array) return item.map(i => {
        return this.normalize(i);
      })
      else if (item.fields instanceof Object) {
        return {
          type: (item.sys.type === 'Asset') ? 'Asset' : item.sys.contentType.sys.id,
          id: item.sys.id,
          content: Object.keys(item.fields).reduce((acc, field) => {
            acc[field] = this.normalize(item.fields[field])
            return acc;
          }, {})
        }
      }
      return item;
    }

  }

};
