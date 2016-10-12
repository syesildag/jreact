/* global describe, it, beforeEach */
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typescript/utils.ts"/>

'use strict';

//SERKAN

var assert = require('assert');

describe('addition', function() {
  var self = this;

  beforeEach(() => {
    self.onePlusOne = 1 + 1;
  });

  it('should add 1+1 correctly', function(done) {
    assert.equal(2, self.onePlusOne);
    // must call done() so that mocha know that we are... done.
    // Useful for async tests.
    done();
  });

  it('Utils.pluralize', function(done) {
    assert.equal("cars", Utils.pluralize(2, "car"));
    done();
  });
});
