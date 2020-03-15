// rollup.config.js
import typescript from 'rollup-plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: 'src/index.tsx',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  external: ['react', 'react-dom'], // <-- suppresses the warning
  plugins: [
    postcss({
      extensions:['css', 'scss'],
    }),
    typescript(),
    serve({
      open: true,
      contentBase: ['dist', 'public'],
      port: 8001,
    }),
    livereload({
      watch: ['dist', 'public'],
    }),
  ],
}