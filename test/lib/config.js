'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');

let JsConfig = require('../../lib/config');

describe('JsConfig', () => {

    it('gives back a config through "get" method', () => {
        var fs = {
            readFileSync: sinon.stub().returns('{"test.config": "TEST_CONFIG_VALUE"}')
        };
        var loadPath = 'path/to/config_file';
        var config = new JsConfig({fs, loadPath});
        expect(config.get('test.config')).to.be.equal('TEST_CONFIG_VALUE');
    });
});
