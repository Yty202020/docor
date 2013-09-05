var fs = require('fs'),
    optimist = require('optimist'),
    argv = optimist.argv,
    swig = require('swig'),
    consoler = require('consoler'),
    path = require('path'),
    sys = require('./package.json'),
    readme = swig.compileFile('./tpl/readme.md'),
    license = swig.compileFile('./tpl/license.md'),
    ignore = fs.readFileSync('./tpl/ignore');

var licenseMap = function(pkg) {
    try {
        return fs.readFileSync('./licenses/' + pkg.license);
    } catch (e) {
        return null;
    };
};

exports.ignore = function(filename, cb) {
    var dir = process.cwd();
    fs.writeFile(path.join(dir, filename), ignore, function(err) {
        if (!err) {
            cb(null);
        } else {
            cb(err);
        }
    });
}

exports.readme = function(filename, cb) {
    var dir = process.cwd(),
        pkg = require(dir + '/package.json');

    fs.writeFile(filename, readme({
        pkg: pkg,
        license: licenseMap(pkg),
        year: new Date().getFullYear(),
        sys: sys
    }), function(err) {
        if (!err) {
            cb(null, readme);
        } else {
            cb(err);
        }
    });
}

exports.license = function(cb) {
    var dir = process.cwd(),
        pkg = require(dir + '/package.json');

    fs.writeFile('LICENSE', license({
        pkg: pkg,
        license: licenseMap(pkg),
        year: new Date().getFullYear()
    }), function(err) {
        if (!err) {
            cb(null);
        } else {
            cb(err);
        }
    });
}

exports.cli = function() {
    consoler.align(7);
    var filename = 'README.md';
    if (argv.n) filename = argv.n
    exports.readme(filename, function(err, md) {
        if (!err) {
            consoler.success(filename + ' created.');
        } else {
            consoler.error('Opps:');
            console.log(err);
        }
    });
    exports.license(function(err) {
        if (!err) {
            consoler.success('LICENSE' + ' created.');
        } else {
            consoler.error('Opps:');
            console.log(err);
        }
    });
    exports.ignore('.gitignore',function(err) {
        if (!err) {
            consoler.success('.gitignore' + ' created.');
        } else {
            consoler.error('Opps:');
            console.log(err);
        }
    });
    exports.ignore('.npmignore',function(err) {
        if (!err) {
            consoler.success('.npmignore' + ' created.');
        } else {
            consoler.error('Opps:');
            console.log(err);
        }
    });
}