// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  access: {},
  request: {},
  conventionLayout: false,
  layout: false,
  metas: [
    { name: 'viewport', content: 'width=device-width,initial-scale=1.0' },
  ],
  npmClient: 'pnpm',
  mock: false,
  history: {
    type: 'hash',
  },
  historyWithQuery: {},
  hash: true,
  title: 'h5初始',
  routes,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  proxy: proxy[(REACT_APP_ENV || 'dev') as keyof typeof proxy],
  fastRefresh: true,
  model: {},
  initialState: {},
  mfsu: {},
});
