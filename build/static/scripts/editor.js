function Editor(code) {
	var structure = '<div class="editor"><div class="view-editor"></div><div class="view-viewer"></div><div class="controls"><button class="button markdownMode active" title="Edit mode"></button><button class="button viewMode" title="View mode"></button><span class="indicator">Edit mode</span></div></div>';
	var node = $(structure);

	var mirror = CodeMirror(node.find('.view-editor')[0], {
		value: code,
		theme: 'neue',
		lineWrapping: true,
		lineNumbers: true
	});

	var buttons = node.find('.controls .button');
	var indicator = node.find('.indicator');
	var viewers = {
		viewer: node.find('.view-viewer'),
		editor: node.find('.view-editor')
	};

	buttons.click(function () {
		buttons.removeClass('active');
		$(this).addClass('active');

		if ($(this).hasClass('markdownMode')) {
			// hide view, show editor
			viewers.viewer.html('').addClass('hide');
			viewers.editor.removeClass('hide');
			indicator.text('Edit mode');
		} else {
			// hide editor, show view
			viewers.editor.addClass('hide');
			viewers.viewer.html(marked(mirror.getValue())).removeClass('hide');
			indicator.text('View mode');
		}
	});

	this.toDOM = function () {
		return node;
	};

	this.refresh = function () {
		mirror.refresh();
	};
}

var editors = [];

var nodes = $('pre code.lang-markdown');
for (var i = 0; i < nodes.length; i++) {
	var node = $(nodes[i]);
	editors[i] = new Editor(node.text());
	node.parent().replaceWith(editors[i].toDOM());
	editors[i].refresh();
}
