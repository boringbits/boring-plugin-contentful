import mods2require from 'mods2require';
import {normalize} from 'path';
import { array } from 'prop-types';

module.exports = function setupRoute(/* dependencies from boring */ BoringInjections) {

  const {
    decorators,
    injecture,
    boring,
    config,
  } = BoringInjections;

  const {
    reactEntry,
    router,
    get,
    post,
  } = decorators.router;


  boring.beforeSync('requireHandlerPaths', (context) => {

    const paths = context.reactHandlerPaths;

    if (paths.includeContentViews !== false) {

      mods2require(null, normalize(__dirname + '/../../client/plugin-components/content/views')).forEach(mod => {
        paths.modulesToRequire[`contentViews.${mod.moduleName}`] = mod.requirePath;
      });

      const globalViews = config.get('content.globalViews', [paths.app_dir, 'modules', '@content/views'].join('/'));
      mods2require(null, normalize(globalViews)).forEach(mod => {
        paths.modulesToRequire[`contentViews.${mod.moduleName}`] = mod.requirePath;
      });

      const appViewDir = paths.contentViews ||  normalize([paths.app_dir, paths.baseAppPath, 'content/views'].join('/'));
      mods2require(null, appViewDir).forEach(mod => {
        paths.modulesToRequire[`contentViews.${mod.moduleName}`] = mod.requirePath;
      });

      const withContentPath = normalize(__dirname + '/../../client/plugin-components/decorators/withContent');
      const withContent = require(withContentPath);
      withContent.importPath = withContentPath;
      paths.decorators.withContent = withContent;
    }

  });



  const contentfulAPI = injecture.get('ContentfulAPI');

  async function getRoot() {
    const sitemap = await contentfulAPI.getEntries('sitemapNode');
    const root = sitemap.items.filter(node => (node.content.name === 'home' || node.content.name === 'root')).pop();
    return {
      root,
      includes: sitemap.includes,
    };
  }

  @router('/content')
  class ContentfulRouter {

    @post('/setChildren')
    setChildren(req, res) {

      const client = contentfulAPI.getManagementClient();

      client.getSpace(config.get('clients.contentful.space'))
        .then((space) => space.getEnvironment(config.get('clients.contentful.environment', 'dev')))
        .then((environment) => environment.getEntry(req.body.id))
        .then((entry) => {
          const children = entry.fields.children['en-US'];
          const childrenById = children.reduce((acc, child) => {
            acc[child.sys.id] = child;
            return acc;
          }, {});
          entry.fields.children['en-US'] = req.body.children.map(child => childrenById[child.id]);
          return entry.update();
        })
        .then(entry => {
          res.json(entry.toPlainObject());
        })
        .catch(e => {
          res.json({error: e});
        });
    }

    @post('/update')
    async update(req, res) {
      const client = contentfulAPI.getManagementClient();

      const id = req.body.id;
      const entityFields = req.body.entityFields;

      client.getSpace(config.get('clients.contentful.space'))
        .then((space) => space.getEnvironment(config.get('clients.contentful.environment', 'master')))
        .then((environment) => environment.getEntry(id))
        .then((entry) => {
          Object.keys(entityFields).forEach(key => {
            entry.fields[key]['en-US'] = entityFields[key];
          });
          return entry.update();
        })
        .then(entry => res.json(entry))
        .catch(e => res.json({error: e}));
    }

    @get('/data/pages/:path/info.json')
    async page_data(req, res) {

      const path = decodeURIComponent(req.params.path)
      const content = await contentfulAPI.getPage(path);
      if (!content || !content.items || content.items.length !== 1) return res.json({});
      const pageModel = content.items.pop();

      res.json({
        page: pageModel,
        contentful: content.includes,
      });

    }

    @get('/data/page_alias/:alias')
    async getByAlias(req, res) {
      const page_alias = req.params.alias;

      const content = await contentfulAPI.getEntries('page', {'fields.alias': page_alias});
      res.json(content);
    }

    @get('/data/pages')
    async sitemapData(req, res) {

      const pages = await contentfulAPI.getEntries('page');
      res.json(pages
        .items
        .map(item => ({url: item.content.url, name: item.content.title}))
        .sort((itemA, itemB) => {
          if (itemA.url < itemB.url) return -1;
          else if (itemA > itemB.url) return 1;
          else return 0;
        }));
    }

    @get('/data/sitemap')
    async sitemapData(req, res) {
      const nodes = await contentfulAPI.getEntries('sitemapNode');
      res.json(nodes);
    }

    @get('/sitemap')
    @reactEntry({
      clientRoot: __dirname + '/../../client/pages',
      app_dir: '',
      reactRoot: 'sitemap',
    })
    async sitemap(req, res) {
      if ((config.get('boring.isDevelopment', false) === true) ||
        config.get('boring.plugins.boring-plugin-contentful.showSitemap', false) === true) {

        const sitemap = await getRoot();

        res.renderRedux({
          layout: {
            clientConfig: {
              contentful: {
                space: config.get('clients.contentful.space'),
                environment: config.get('clients.contentful.environment', 'master'),
              },
            },
          },
          components: {
            preloadedState: {
              sitemap: {
                root: sitemap.root,
              },
              contentful: sitemap.includes,
            }
          }
        });
      }
      else {
        res.send('');
      }
    }

  }

};

