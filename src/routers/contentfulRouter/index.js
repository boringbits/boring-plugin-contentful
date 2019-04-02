import mods2require from 'mods2require';
import {normalize} from 'path';

module.exports = function setupRoute(/* dependencies from boring */ BoringInjections) {

  const {
    boring
  } = BoringInjections;

  boring.beforeSync('requireHandlerPaths', (context) => {

    const paths = context.reactHandlerPaths;

    if (paths.includeContentViews !== false) {

      mods2require(null, normalize(__dirname + '/../../client/components')).forEach(mod => {
        paths.modulesToRequire[`contentViews.${mod.moduleName}`] = mod.requirePath;
      });

      const appViewDir = paths.contentViews ||  normalize([paths.app_dir, paths.baseAppPath, 'contentViews'].join('/'));
      mods2require(null, appViewDir).forEach(mod => {
        paths.modulesToRequire[`contentViews.${mod.moduleName}`] = mod.requirePath;
      });

      const withContentPath = normalize(__dirname + '/../../client/withContent');
      const withContent = require(withContentPath);
      withContent.importPath = withContentPath;
      paths.decorators.withContent = withContent;
    }

  });

  const {
    decorators,
    injecture,
    config,
  } = BoringInjections;

  const {
    reactEntry,
    router,
    get,
  } = decorators.router;

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
      clientRoot: __dirname + '/../../client',
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

