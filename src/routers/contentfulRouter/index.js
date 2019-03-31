

module.exports = function setupRoute(/* dependencies from boring */ BoringInjections) {

  const {
    boring
  } = BoringInjections;

  boring.beforeSync('setReactHandlerPaths', (context) => {

    context.reactHandlerPaths.modulesToRequire.foo = __dirname + '/../../client/components/foo';
    // console.log(context);
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
      sitemap: true,
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

