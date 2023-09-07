// 运行时配置
import type { RequestConfig } from '@umijs/max';
import './plugins/fexible.ts';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const request: RequestConfig = {
  timeout: 1000,
  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [
    (url, options) => {
      // do something
      return { url, options };
    },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [
      (url, options) => {
        return { url, options };
      },
      (error) => {
        return Promise.reject(error);
      },
    ],
    // 数组，省略错误处理
    [
      (url, options) => {
        return { url, options };
      },
    ],
  ],
  responseInterceptors: [
    (response) => {
      // 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
      const { data = {} as any, config } = response;
      // do something
      return response;
    },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      },
    ],
    // 数组，省略错误处理
    [
      (response) => {
        return response;
      },
    ],
  ],
};
