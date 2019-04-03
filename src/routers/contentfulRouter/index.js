import mods2require from 'mods2require';
import {normalize} from 'path';

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

  @router('/content')
  class ContentfulRouter {

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

    @get('/sitemap')
    @reactEntry({
      clientRoot: __dirname + '/../../client/pages',
      app_dir: '',
      reactRoot: 'sitemap',
    })
    sitemap(req, res) {
      if (config.get('boring.isDevelopment', false) === true) {
        res.renderRedux({});
      }
      else {
        res.send('');
      }
    }


  }

};

