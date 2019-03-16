rm -rf node_modules/boringbits node_modules/@babel node_modules/.bin/boring-down node_modules/.bin/boring node_modules/react-helmet
ln -s $PWD/../boring/ node_modules/boringbits
cp -a $PWD/../boring/node_modules/@babel node_modules/@babel
ln -s $PWD/../boring/bin/boring-cli.js node_modules/.bin/boring
ln -s $PWD/../boring/node_modules/react-helmet node_modules/react-helmet