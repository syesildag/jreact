/* global describe, it, beforeEach */
/// <reference path="../src/utils.ts"/>

'use strict';

//SERKAN

let assert = require('assert');

describe('addition', function() {
  let self: any = {};

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
