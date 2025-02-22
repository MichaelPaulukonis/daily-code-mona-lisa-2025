# Daily Code Mona Lisa

Instead of "just" a manually (digitally) made Mona Lisa version, generate one with code!
That is, new code every day.
For a month.

Hopefully.


## shader notes

```
console.log('Max texture size:', document.createElement('canvas').getContext('webgl').getParameter(WebGLRenderingContext.MAX_TEXTURE_SIZE));
```

https://waelyasmina.net/articles/9-hands-on-glsl-examples-for-shader-newbies/


## P5.js-vite Starter Template 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Vite](https://vitejs.dev/) starter template to scaffold a new [p5.js](https://p5js.org) project.

This is an unopinionated template; aside from P5.js and Vite, the rest of your project's tools are entirely up to you.

## Live demo

For a live demo please [visit this page](https://p5js-vite-demo.surge.sh).

## Installation

Pull the template files with [degit](https://github.com/Rich-Harris/degit) and install dependencies.

```
npx degit makinteract/p5js-vite my-project

cd my-project
npm install
npm run dev
```

## npm scripts

- `npm run dev` - Starts the development server at port [3000](http://localhost:3000/)
- `npm run build` - Builds the application in a `dist` folder
- `npm run preview` - Serves the build files (`dist` folder) locally at port [5000](http://localhost:3000/)

Note that if after this last command you do not see anything, you can use instead this other command:

- `npm run preview --host` - You should then be able to see your files locally at port [5000](http://localhost:3000/)

## License

This project is open source and available under the [MIT License](LICENSE).
