import { defineConfig } from 'umi';
import { routes } from './src/routers';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  publicPath: './',
  hash: true,
  history: {
    type: 'hash',
  },
  define: {
    'process.env.ENV': process.env.ENV,
  },
  title: '即时通讯 Demo',
  routes,
  fastRefresh: {},
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    baseNavigator: true,
    baseSeparator: '-',
    default: 'zh-CN',
    useLocalStorage: true,
  },
  chainWebpack(memo, args) {
    // 当 package.json 中的 antd 版本低于 im-ui-kit 要求的 antd 版本时，需要配置以下两行代码。这是由于 umi webpack alias 指定路径错误导致的
    // const alias = memo.resolve.alias;
    // alias.delete('antd');
  },
});
