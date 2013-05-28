thEvaluator-webapp
==================

website to create and evaluate test cases of thEvaluator project.

## Getting Started

Requirements: [Node](https://github.com/joyent/node/wiki/Installation#installing-without-building), [Ruby](http://www.ruby-lang.org/en/downloads/), [Sass](http://sass-lang.com/download.html)

This web application requires [Yeoman](http://yeoman.io/) as dev enviroment and [Bower](http://bower.io/)
as package manager. Please install both via NPM in the command line for development.

Once the requirements are installed, download the app dependencies via:

```shell
$ npm install -g bower
$ npm install -g grunt-cli

$ npm install
$ bower install
```

After this, start the app with:

```shell
$ grunt build
$ grunt forever:start
```