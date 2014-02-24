/*global describe, it, beforeEach, after */

var assert = require('chai').assert;
var fs = require('fs-extra');
var path = require('path');
var resolve = path.resolve;
var exec = require('child_process').exec;

var fixtureDir = resolve(__dirname, 'fixtures');
var tmpDir = resolve(__dirname, '../tmp');
var uninstall = resolve(__dirname, '../bin/component-uninstall');


describe('component uninstall', function() {
  beforeEach(function(done) {
    fs.copy(fixtureDir, tmpDir, done);
  });

  after(function(done) {
    fs.remove(tmpDir, done);
  });

  it('should do nothing', function(done) {
    uninstallExec('foo/bar', function(err) {
      if (err) return done(err);

      readComponent(function(err, component) {
        if (err) return done(err);

        assert.isDefined(component.dependencies['component/emitter']);
        assert.isDefined(component.dependencies['nk-components/math-fit']);
        assert.isTrue(depDirExists('component-emitter'));
        assert.isTrue(depDirExists('nk-components-math-fit'));

        done();
      });
    });
  });

  it('should remove dependency from component.json', function(done) {
    uninstallExec('component/emitter', function(err, stdout) {
      if (err) return done(err);

      readComponent(function(err, component) {
        if (err) return done(err);

        assert.match(stdout, /uninstalled.*component\/emitter/);
        assert.isUndefined(component.dependencies['component/emitter']);
        assert.isDefined(component.dependencies['nk-components/math-fit']);
        assert.isFalse(depDirExists('component-emitter'));
        assert.isTrue(depDirExists('nk-components-math-fit'));

        done();
      });
    });
  });

  it('should remove dependencies from component.json', function(done) {
    uninstallExec('component/emitter nk-components/math-fit', function(err, stdout) {
      if (err) return done(err);

      readComponent(function(err, component) {
        if (err) return done(err);

        assert.match(stdout, /uninstalled.*component\/emitter/);
        assert.isUndefined(component.dependencies['component/emitter']);
        assert.isUndefined(component.dependencies['nk-components/math-fit']);
        assert.isFalse(depDirExists('component-emitter'));
        assert.isFalse(depDirExists('nk-components-math-fit'));

        done();
      });
    });
  });

  it('should works with just the component name', function(done) {
    uninstallExec('emitter math-fit', function(err, stdout) {
      if (err) return done(err);

      readComponent(function(err, component) {
        if (err) return done(err);

        assert.match(stdout, /uninstalled.*component\/emitter/);
        assert.match(stdout, /uninstalled.*nk-components\/math-fit/);
        assert.isUndefined(component.dependencies['component/emitter']);
        assert.isUndefined(component.dependencies['nk-components/math-fit']);
        assert.isFalse(depDirExists('component-emitter'));
        assert.isFalse(depDirExists('nk-components-math-fit'));

        done();
      });
    });
  });
});

function readComponent(cb) {
  fs.readJson(resolve(tmpDir, 'component.json'), cb);
}

function uninstallExec(components, cb) {
  exec('cd ' + tmpDir + ' && ' + uninstall + ' ' + components, cb);
}

function depDirExists(dep) {
  return fs.existsSync(resolve(tmpDir, 'components/' + dep));
}
