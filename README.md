# OpenAI-API-Key 余额查询网站
因为不放心网上的 Key API 查询网站，所以想自己建一个简单的，通过开源项目找到了查询接口，然后让 GPT-4 写的 OpenAI-Key 余额查询的代码（ 100%AI 完成） 
基于Cloudflare Workers自部署查询OpenAI-API-Key密钥详情

## 部署教程
直接在 Cloudflare Workers 网页版中新建项目，并复制本仓库中的  [apikey.js](https://github.com/Aiayw/OpenAI-API-Key/blob/main/apikey.js)
到在线编辑器中保存即部署完成。  
预览网页：https://apikey.aiayw.workers.dev

## 代码描述

这段代码实现了一个Web应用程序，通过OpenAI API查询密钥信息。它由两个部分组成：前端HTML和后端JavaScript代码。

前端HTML部分定义了一个表单，允许用户输入API密钥并提交查询请求。在用户提交查询请求后，后端JavaScript代码将查询API以获取与API密钥相关的详细信息，并在前端HTML中显示该信息。

后端JavaScript代码使用addEventListener()函数添加了一个事件监听器来处理来自客户端的请求。当请求的URL路径为`/api`时，将检查查询字符串中是否包含API密钥。如果没有，则会返回一个HTTP 400错误。

如果提供了API密钥，则会使用该密钥向OpenAI API发出请求，并在响应中获取账户名称、是否绑定卡、已消费额度、账户额度、额度上限等详细信息。然后，使用这些信息计算出已用额度和剩余额度，并将所有这些信息作为JSON响应返回给客户端。

在前端HTML部分中，提交表单时会触发JavaScript事件处理程序，该处理程序会防止表单提交，并向`/api`发出查询请求，然后使用响应中的信息更新表格。

此外，这段代码使用了Bootstrap库，该库提供了许多CSS和JavaScript组件，用于实现响应式设计和交互效果。

## 网页预览
![网页捕获_](https://v2.cm/2023/05/02/644fec61e0eb7.jpeg)
