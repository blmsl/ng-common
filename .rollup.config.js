//import rollup from 'rollup'
//import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'
//paths are relative to the execution path

const fileName = 'common';
const moduleName = '@rd/common';
const moduleVersion = '';


var config = {
    input: `dist/public_api.js`,
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/http',
        '@rd/core',
        'moment',
        'moment-range',
        'moment-timezone',
        'rxjs/Rx'
    ],
    output: {
        name: moduleName,
        file: `dist/bundles/${fileName}.umd${ process.env.UGLIFY ? '.min' : '' }.js`, // output a single application bundle
        sourcemap: true,
        sourcemapFile: `dist/bundles/${fileName}.umd${ process.env.UGLIFY ? '.min' : '' }.js.map`,
        format: 'umd',
        // external: ['@angular', 'rxjs/*'],
        // paths: {
        //     d3: 'https://d3js.org/d3.v4.min'
        // },
        globals: {
            '@angular/core': 'ng.core',
            '@angular/common': 'ng.common',

            '@rd/core': 'rd.core',
            '@rd/forms': 'rd.forms',

            'moment': 'moment',
        },
        // banner: '/* my-library version ' + libraryVersion + ' */',
        // footer: '/* follow me on Twitter! @rich_harris */'
    },
    onwarn: function (warning) {
        var code = warning.code;
        var loc = warning.loc;
        var frame = warning.frame;
        var message = warning.message;

        // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (/The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten./.test(message)) {
            return;
        }
    },
    plugins: [
        {
            name: 'replace moment imports',
            transform: code =>
                ({
                    code: code.replace(/import\s*\*\s*as\s*moment/g, 'import moment'),
                    map: { mappings: '' }
                })
        },
        /* https://github.com/rollup/rollup-plugin-node-resolve */
        // nodeResolve({ jsnext: true, module: true }), causes sourcemap errors
        /* https://github.com/rollup/rollup-plugin-commonjs */
        commonjs({
            include: ['node_modules/rxjs/**']
        })
    ]
  }

  if(process.env.UGLIFY){
    /* https://github.com/TrySound/rollup-plugin-uglify */
    config.plugins.push(uglify())
  }

  export default config;
