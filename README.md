# generator-sap-a-team-mta [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> SAP A-Team MTA Base Project

## Installation

First, install [Yeoman](http://yeoman.io) and generator-sap-a-team-mta using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-sap-a-team-mta
```

Create additional subgenerators (For Andrew Only)
```bash
yo generator:subgenerator module-php
```

Then generate your new project:

```bash
yo sap-a-team-mta
```

Then (optionally) subgenerate additional modules:

```bash
yo sap-a-team-mta:jenkins       ; echo "Add Jenkins(Piper) support"
yo sap-a-team-mta:deploy2xsa    : echo "Add Deploy to XSA extension"
yo sap-a-team-mta:db-hdb        ; echo "HANA HDB-styled HDI DB"
yo sap-a-team-mta:db-cap        ; echo "HANA CAP-styled HDI DB"
yo sap-a-team-mta:db-ss         ; echo "HANA SecureStore"
yo sap-a-team-mta:module-nodejs ; echo "New NodeJS Module"
yo sap-a-team-mta:module-java   ; echo "New Java Module"
yo sap-a-team-mta:module-python ; echo "New Python Module"
yo sap-a-team-mta:module-docker ; echo "New Docker Module"
```

If you git clone this repo, get it to show up in Yeoman by using npm link from the repo directory. (sudo if perm issues)
```
npm link
sudo npm link
```
The last line of the output should look like this.
```
/usr/local/lib/node_modules/generator-sap-a-team-mta -> /Users/i830671/git/generator-sap-a-team-mta
```

Yeoman looks for generators installed in:
```
cd /usr/local/lib/node_modules/
```

In SAP Business Application Studio Dev Space:
```
~/.node_modules_global/lib/node_modules/
```

Now when you run yo, you should see a choice called __Sap A Team Mta Base__

For SAP Application Studio (Beta).  Open a new terminal.
```
cd ~
mkdir generators
cd generators
git clone https://github.com/alundesap/generator-sap-a-team-mta.git
npm install -g generator-sap-a-team-mta
cd ~
cd projects
```

Then generate your new project:


## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Andrew Lunde](https://github.com/alundesap)


[npm-image]: https://badge.fury.io/js/generator-sap-a-team-mta.svg
[npm-url]: https://npmjs.org/package/generator-sap-a-team-mta
[travis-image]: https://travis-ci.com/alundesap/generator-sap-a-team-mta.svg?branch=master
[travis-url]: https://travis-ci.com/alundesap/generator-sap-a-team-mta
[daviddm-image]: https://david-dm.org/alundesap/generator-sap-a-team-mta.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/alundesap/generator-sap-a-team-mta
