/**
 * Copyright (c) PJBlog Platforms, net. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author evio<evio@vip.qq.com>
 * @Website https://www.pjhome.net
 */

'use strict';

import { ISchema } from '../schema/types';
// 响应的MIME类型 (produces)：
export type SwaggerProducesMIME =
  | 'application/json' // 用于表示响应中的 JSON 数据。这是Web API中最常用的MIME类型，通常用于传递结构化数据。
  | 'application/xml' // 用于表示响应中的 XML 数据。这对于一些遗留系统和服务仍然很常见。
  | 'text/plain' // 用于表示纯文本响应。通常用于返回纯文本内容，如纯文本文件或文本消息。
  | 'text/html' // 用于表示HTML响应。这对于返回HTML页面或富文本内容非常有用。
  | 'application/pdf' // 用于表示PDF文档。在某些情况下，API可能会生成或接受PDF文件。
  | 'application/octet-stream' // 用于表示二进制响应，通常在文件上传和下载时使用。这可以用于传输二进制文件，如图像、音频或视频。
  | 'image/jpeg' | 'image/png' | 'image/gif' // 用于表示不同图像格式的响应。这对于返回图像文件非常有用。
  | 'application/csv' // 用于表示响应中的逗号分隔值（CSV）数据。这对于导出数据到电子表格非常有用。
  | 'application/zip' | 'application/gzip' // 用于表示响应中的压缩文件，如ZIP或GZIP文件。
  | 'application/vnd.ms-excel' // 用于表示Microsoft Excel电子表格文件。这在导出数据到Excel文件时非常有用。
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // 用于表示Microsoft Excel 2007及更高版本的电子表格文件。
  | 'application/vnd.ms-powerpoint' // 用于表示Microsoft PowerPoint演示文稿。
  | 'application/vnd.ms-word' // 用于表示Microsoft Word文档。
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // 用于表示Microsoft Word 2007及更高版本的文档。
  | 'application/vnd.ms-outlook' // 用于表示Microsoft Outlook邮件。
  | 'application/vnd.apple.pages' // 用于表示Apple Pages文档。
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation' // 用于表示Microsoft PowerPoint 2007及更高版本的演示文稿。
  | 'application/vnd.adobe.indesign' // 用于表示Adobe InDesign文档。
  | 'text/event-stream' // sse
  ;

// 请求的MIME类型 (consumes)：
export type SwaggerConsumesMIME =
  | 'application/json' // 用于指示请求主体包含JSON格式的数据。这在通过POST或PUT请求发送JSON数据时常用。
  | 'application/xml' // 用于指示请求主体包含XML格式的数据。与JSON一样，这对于发送结构化数据非常有用。
  | 'application/x-www-form-urlencoded' // 用于指示请求是通过HTML表单提交的。这通常与POST请求一起使用，以便接受表单数据。
  | 'multipart/form-data' // 用于指示请求使用多部分表单数据格式，通常用于文件上传。这也与POST请求一起使用。
  | 'application/graphql' // 用于指示请求主体包含GraphQL查询。这对于GraphQL API非常有用。
  | 'application/json-patch+json' // 用于表示JSON补丁请求，通常用于部分更新操作。
  | 'application/ld+json' // 用于表示JSON-LD，一种用于语义网数据的JSON格式。
  | 'application/rss+xml' // 用于表示请求的RSS或Atom Feed数据。
  | 'application/msgpack' // 用于表示MessagePack编码数据，一种高效的二进制数据序列化格式。
  | 'application/vnd.ms-excel.addin.macroenabled.12' // 用于表示Microsoft Excel支持宏的电子表格文件。
  | 'application/vnd.oasis.opendocument.text' // 用于表示OpenDocument文本文档。
  | 'application/vnd.mozilla.xul+xml' // 用于表示XUL (XML User Interface Language)文件。
  | 'application/vnd.lotus-wordpro' // 用于表示Lotus WordPro文档。
  | 'application/vnd.wap.wmlc' // 用于表示WML (Wireless Markup Language) 编译文件。
  | 'application/vnd.wap.xhtml+xml' // 用于表示WAP（Wireless Application Protocol）的XHTML文档。
  | 'application/vnd.apple.numbers' // 用于表示Apple Numbers电子表格。
  | 'application/vnd.oasis.opendocument.presentation' // 用于表示OpenDocument演示文稿。
  ;


export interface SwaggerInfo {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: SwaggerContact;
  license?: SwaggerLicense;
}

export interface SwaggerContact {
  name?: string;
  url?: string;
  email?: string;
}

export interface SwaggerLicense {
  name: string;
  url?: string;
}

export interface SwaggerPath {
  [path: string]: {
    [httpMethod: string]: SwaggerOperation;
  };
}

export interface SwaggerOperation {
  tags?: string[],
  summary?: string;
  description?: string;
  consumes?: SwaggerConsumesMIME[],
  deprecated?: boolean,
  operationId?: string,
  produces?: SwaggerProducesMIME[],
  parameters?: SwaggerParameter[];
  responses: {
    [statusCode: string]: SwaggerResponse;
  };
}

export interface SwaggerParameter {
  name: string;
  in: "query" // 表示参数是从查询字符串中获取的，通常出现在 URL 中，例如 ?key=value。
  | "header" // 表示参数是从请求标头中获取的，通常包含在 HTTP 请求的头部信息中。
  | "path" // 表示参数是从 URL 路径中提取的，通常用于 RESTful API 中的路由参数。
  | "cookie" // 表示参数是从请求的 Cookie 中获取的。
  | "formData" // 通常用于 H // 表示参数是请求体的一部分，通常包含 JSON 或 XML 数据。这通常与 POST、PUT、PATCH 等请求一起使用。
  | "body"
  description?: string;
  required?: boolean;
  schema: ISchema;
}

export interface SwaggerResponse {
  description: string;
  content?: Record<SwaggerProducesMIME/* contentType */, {
    schema: ISchema;
  }>,
  schema?: ISchema
}

export interface SwaggerExternalDoc {
  description: string,
  url: string,
}

export interface SwaggerTag {
  name: string,
  description: string,
  externalDocs?: SwaggerExternalDoc,
}

export interface SwaggerSpec {
  swagger: string; // 或 "swagger"，取决于您的规范
  basePath?: string,
  host?: string,
  info: SwaggerInfo;
  paths: SwaggerPath;
  definitions: Record<string, ISchema>,
  externalDocs?: SwaggerExternalDoc,
  schemes?: string[],
  tags?: SwaggerTag[],
  // [key: string]: any,
  // 可能还有其他字段，根据具体规范定义
}

export type SwaggerProps = Omit<SwaggerSpec, 'paths' | 'definitions' | 'tags'>