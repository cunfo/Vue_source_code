// 这个脚本文件会帮助打包packages目录下的模块，最终打包成js文件

/* 在package.json中的scripts模块中配置
 "scripts": {
    "dev": "node dev.js 要打包的文件 -f 打包的方式 " === argv
  },
*/

import minimist from "minimist";
import path from "path";
import url from "url";
import module from "module";
import esbuild from "esbuild";


// node中的命令函参数通过process来获取process.argv
const args = minimist(process.argv.slice(2))
// import.meta.url：获取当前文件的绝对路径，file: -> /url
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const require = module.createRequire(import.meta.url);

const target = args._[0] || 'reactivity'; // 要打包的文件
const fotmat = args.f || 'life' // 打包后的模块化规范

// 入口文件 根据命令行提供的路径来解析。node中的esm模块没有__dirname，需要解析
const entry = path.resolve(__dirname, `../packages/${target}/src/index.ts`)
const pkg = require(`../packages/${target}/package.json`)

// 根据需求打包
esbuild.context({
  entryPoints: [entry], //入口
  outfile: path.resolve(__dirname, `../packages/${target}/dist/${target}.js`), // 出口
  bundle: true, // reactivity -> shared 会打包到一起
  platform: 'browser', // 打包后给浏览器使用
  sourcemap: true, // 可以调试源代码
  format: fotmat, // esm-bundler, cjs, global life
  globalName: pkg.buildOptions?.name, // 全局变量名
}).then((ctx) => {
  console.log('打包完成');
  return ctx.watch()
}).catch((err) => {
  console.error('打包失败', err);
})

// console.log(process.argv);
/* 
  # process是node.js中的全局对象，提供了关于当前进程的信息。
    process.argv 是一个参数向量(数组)，包含了命令行参数，
    数组结构如下：
    [0] 是 node.js 的执行路径 例如：'C:\\Program Files\\nodejs\\node.exe',
    [1] 是当前运行的脚本的绝对路径 例如这个文件'C:\\Users\\Administrator\\Desktop\\vue3-review\\vue-lesson\\scripts\\dev.js'
    [2] 是第一个传入的参数，依此类推
  # minimist 是一个解析命令行参数的模块，可以用来解析命令行参数，例如： 
    node dev.js --name="Vue" --age=20  这里的 --name="Vue" --age=20 就是命令行参数 => 传出的结果为 {_:[], name: 'Vue', age: 20 }
    数组中的参数按照规则进行解析成一个javaScript对象：例如 -f esm, --format=esm, --watch、位置参数等
*/
// console.log(import.meta);
/* 
    import.meta 是一个对象，包含了当前模块的一些元数据。
    1.import.meta.url 是一个字符串，包含了当前模块的绝对路径，值: 'file:///C:/Users/Administrator/Desktop/vue3-review/vue-lesson/scripts/dev.js'
    2.import.meta.dirname 是一个字符串，包含了当前模块的目录名，值: 'C:\\Users\\Administrator\\Desktop\\vue3-review\\vue-lesson\\scripts'
    3.import.meta.filename 是一个字符串，包含了当前模块的文件名，值： 'C:\\Users\\Administrator\\Desktop\\vue3-review\\vue-lesson\\scripts\\dev.js'
    4.import.meta.main 是一个布尔值，表示当前模块是否是主模块，值: true
    5.import.meta.resolve 是一个函数，用于解析模块路径，值: (path) => 'file:///C:/Users/Administrator/Desktop/vue3-review/vue-lesson/scripts/dev.js'
*/
// console.log(__filename);
// console.log(__dirname);
// console.log(require);
// console.log(entry);
// console.log(pkg);
