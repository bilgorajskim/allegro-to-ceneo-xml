# allegro-to-ceneo-xml [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Generates Ceneo integration XML based on provided Allegro offer listing.

## Installation

```sh
$ npm install -g allegro-to-ceneo-xml
```

## Usage

```sh
allegro-to-ceneo-xml <URL> <outputFile?>
```

If outputFile is not provided, the output will be printed on screen.

### Examples

```sh
allegro-to-ceneo-xml "http://allegro.pl/listing/user/listing.php?us_id=43461750"
```
```sh
allegro-to-ceneo-xml "http://allegro.pl/listing/user/listing.php?us_id=43461750" samsung.xml
```

## License

MIT © [Mateusz Biłgorajski]()


[npm-image]: https://badge.fury.io/js/allegro-to-ceneo-xml.svg
[npm-url]: https://npmjs.org/package/allegro-to-ceneo-xml
[travis-image]: https://travis-ci.org/bilgorajskim/allegro-to-ceneo-xml.svg?branch=master
[travis-url]: https://travis-ci.org/bilgorajskim/allegro-to-ceneo-xml
[daviddm-image]: https://david-dm.org/bilgorajskim/allegro-to-ceneo-xml.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/bilgorajskim/allegro-to-ceneo-xml
