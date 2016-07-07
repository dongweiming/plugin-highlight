var path = require('path');
var hljs = require('highlight.js');
var codeHighlightLinenums = require('code-highlight-linenums');


var MAP = {
    'py': 'python',
    'js': 'javascript',
    'json': 'javascript',
    'rb': 'ruby',
    'csharp': 'cs',
};

function normalize(lang) {
    if(!lang) { return null; }

    var lower = lang.toLowerCase();
    return MAP[lower] || lower;
}

function highlight(lang, code) {
    var props, start=null;
    if(!lang) return {
        body: code,
        html: false
    };

    if (lang.indexOf(',') > -1) {
        props = lang.split(',');
        if (props.length > 1 && props[1] == 'numbered') {
            lang = props[0];
            if (props.length === 3) {
                try {
                    start = props[2].split('=')[1].split('"')[1];
                } catch(e) {
                    start = 0;
                }
            } else {
                start = 0;
            }
        }
    }

    // Normalize lang
    lang = normalize(lang);
    code = code.trim();

    try {
        if (start === null) {
            return hljs.highlight(lang, code).value;
        } else {
            return codeHighlightLinenums(code, {hljs: hljs, lang: lang, start: start});
        }
    } catch(e) {
        console.log(e);
    }

    return {
        body: code,
        html: false
    };
}


module.exports = {
    book: {
        assets: './css',
        css: [
            'website.css'
        ]
    },
    ebook: {
        assets: './css',
        css: [
            'ebook.css'
        ]
    },
    blocks: {
        code: function(block) {
            return highlight(block.kwargs.language, block.body);
        }
    }
};
