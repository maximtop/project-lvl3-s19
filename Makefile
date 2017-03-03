install: install-deps

run:
	npm run babel-node -- 'src/bin/page-loader.js' http://allstroi.com

install-deps:
	yarn

build:
	rm -rf dist
	npm run build

test:
	npm test

check-types:
	npm run flow

lint:
	npm run eslint -- src test

publish:
	npm publish

.PHONY: test
