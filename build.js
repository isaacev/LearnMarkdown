// build.js

var _ = require('underscore');
var Async = require('async');
var Handlebars = require('handlebars');
var Sass = require('node-sass');
var Marked = require('marked');
var Frontmatter = require('yaml-front-matter');
var Fs = require('fs');
var Path = require('path');

var buildPath = './build/tutorial.html';
var tutorialTemplatePath = './src/templates/tutorial.hbs';
var lessonsDirectory = './src/lessons';

var scssMainFile = './src/styles/main.scss';
var cssMainFile = './build/static/styles/main.css';

Handlebars.registerHelper('header', function (meta, options) {
	var out = '<h1 id="' + meta.id + '">';

	if (+meta.number > 0) {
		out += '<span class="lesson-number">Lesson ' + meta.number + ':</span> ';
	}

	out += meta.title;

	if (+meta.number > 0) {
		out += '<a class="anchor-link" href="#' + meta.id + '" title="Link to this lesson">#</a>';
	}

	return out + '</h1>';
});

Handlebars.registerHelper('lessons', function (items, options) {
	var out = '';

	for (var i = 0, l = items.length; i < l; i++) {
		out += '<article class="lesson">' + options.fn(items[i]) + '</article>';

		if (i < l - 1) {
			out += '<hr>';
		}
	}

	return out;
});

function filterDirectory(path, filter, callback) {
	if (typeof filter === 'string') {
		// filter is file extension, make sure extension starts with `.`
		if (!/^\./.test(filter)) {
			filter = '.' + filter;
		}
	}

	Fs.readdir(path, function (err, filenames) {
		if (err) {
			callback(err);
		} else {
			var filteredFilenames = _.filter(filenames, function (filename) {
				if (typeof filter === 'string') {
					return Path.extname(filename) === filter;
				} else {
					return filter(filename);
				}
			});

			var filteredPaths = _.map(filteredFilenames, function (filename) {
				return Path.join(path, filename);
			});

			callback(null, filteredPaths);
		}
	});
}

function readFile(path, callback) {
	Fs.exists(path, function (exists) {
		if (!exists) {
			callback('File: "' + path + '" does not exist');
		} else {
			Fs.readFile(path, 'utf8', function (err, data) {
				if (err) {
					callback(err);
				} else {
					callback(null, data);
				}
			});
		}
	});
}

function writeFile(path, data, callback) {
	Fs.writeFile(path, data, function (err) {
		if (err) {
			callback(err);
		} else {
			callback(null);
		}
	});
}

function buildTutorial() {
	readFile(tutorialTemplatePath, function (err, file) {
		if (err) {
			throw err;
		}

		var template = Handlebars.compile(file);

		filterDirectory(lessonsDirectory, '.md', function (err, filenames) {
			Async.map(filenames, readFile, function (err, files) {
				var lessonsUnsorted = _.map(files, function (file) {
					var yaml = Frontmatter.loadFront(file);
					var markdown = yaml.__content;
					var meta = {};

					_.each(yaml, function (value, key) {
						if (!/^\_+/.test(key)) {
							meta[key] = value;
						}
					});

					var lessonHtml = Marked(markdown);

					return {
						meta: meta,
						contents: lessonHtml
					};
				});

				var lessonsSorted = _.sortBy(lessonsUnsorted, function (lesson) {
					return lesson.meta.number;
				});

				var tutorialHtml = template({
					lessons: lessonsSorted
				});

				writeFile(buildPath, tutorialHtml, function (err) {
					if (err) {
						throw err;
					} else {
						console.log('Successfully built to "' + buildPath + '"');
					}
				});
			});
		});
	});

	Sass.render({
		file: scssMainFile,
		outputStyle: 'compressed',
		success: function (result) {
			writeFile(cssMainFile, result.css, function (err) {
				if (err) {
					throw err;
				} else {
					console.log('Successfully parsed and saved styles');
				}
			});
		},
		error: function () {
			console.log('err');
		}
	});
}

buildTutorial();
