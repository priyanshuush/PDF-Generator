const { configure } = require('enzyme');

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;


module.exports = {
    // ... other Jest configurations
    snapshotSerializers: ['enzyme-to-json/serializer'],
  };
