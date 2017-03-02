install: install-deps

run:
<<<<<<< HEAD
	npm run babel-node -- 'src/bin/page-loader.js' http://hexlet.io/coursessss
=======
	npm run babel-node -- 'src/bin/page-loader.js' https://ru.hexlet.io/courses
>>>>>>> 2nd-step

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
