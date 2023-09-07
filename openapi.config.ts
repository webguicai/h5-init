const { generateService } = require('@umijs/openapi');

generateService({
  serversPath: './src/servers', // 接口文件位置
  requestLibPath: "import request from 'umi-request'", // 顶部引入文件，可扩展
  schemaPath: 'http://localhost:3000/api-docs-json', // 接口地址
  // projectName: "interface", // 接口文件夹名称
});
