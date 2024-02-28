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

export interface ISchema {
  type?: "string" | "number" | "integer" | "boolean" | "array" | "object" | "null" | "file";
  format?: 'date' // 表示日期，通常使用 ISO 8601 格式（例如："2023-11-07"）。
  | 'date-time' // 表示日期和时间，也使用 ISO 8601 格式（例如："2023-11-07T12:00:00Z"）。
  | 'time' // 表示时间，通常使用 ISO 8601 时间格式（例如："12:00:00"）。
  | 'email' // 表示电子邮件地址，通常应遵循电子邮件地址的格式。
  | 'uri' // 表示统一资源标识符（URI），通常用于表示 Web 地址或资源标识符。
  | 'uuid' // 表示通用唯一标识符 (UUID)，通常用于唯一标识对象或实体。
  | 'hostname' // 表示主机名，通常用于表示域名或主机。
  | 'ipv4' // 表示 IPv4 地址，用于表示 Internet 协议版本 4 地址。
  | 'ipv6' // 表示 IPv6 地址，用于表示 Internet 协议版本 6 地址。
  | 'credit-card' // 表示信用卡号码，通常用于表示信用卡信息。
  | 'phone-number' // 表示电话号码，用于表示电话号码信息。
  | 'color' // 表示颜色值，通常以十六进制或其他颜色表示方式呈现。
  | 'credit-card-expiration' // 用于表示信用卡的有效期，通常以"MM/YY"格式表示。
  | 'social-security-number' // 用于表示社会安全号码（美国的个人身份证号码）。
  | 'isbn' // 用于表示国际标准书号（ISBN）。
  | 'url' // 用于表示URL，与"uri"类似，但强调它是一个链接。
  | 'iban' // 用于表示国际银行帐号号码（IBAN）。
  | 'bic' // 用于表示国际银行标识代码（BIC）。
  | 'jwt' // 用于表示JSON Web Token（JWT），通常用于身份验证和令牌。
  | 'base64' // 用于表示Base64编码的二进制数据。
  | 'md5' // 用于表示MD5散列值，通常用于数据完整性验证。
  | 'sha-256' // 用于表示SHA-256散列值，通常用于数据完整性验证和加密。
  | 'image' // 图片
  | 'attachment' // 附件
  | 'textarea'
  ;
  items?: ISchema; // 仅当 type 是 "array" 时使用
  properties?: {
    [propertyName: string]: ISchema;
  }; // 仅当 type 是 "object" 时使用
  required?: string[]; // 仅当 type 是 "object" 时使用
  title?: string,
  description?: string,
  default?: any,
  enum?: any[], // 用于定义数据模式的枚举值，列出了允许的特定值。
  enumLable?: any[],
  placeholder?: string,
  style?: any,
  boolabel?: string[],
  rows?: number, // format=textarea有效
  readOnly?: boolean, // 指示数据模式是否是只读的，通常用于表示不可更改的属性。
  writeOnly?: boolean, // 指示数据模式是否是只写的，通常用于表示只能写入的属性。
  minLength?: number, maxLength?: number, // 用于字符串类型，分别指定字符串的最小和最大长度。
  minimum?: number, maximum?: number, // 用于数值类型，分别指定数值的最小和最大值。
  exclusiveMinimum?: boolean, exclusiveMaximum?: boolean, // 用于数值类型，指示最小和最大值是否是排除的。
  pattern?: string, // 用于字符串类型，指定一个正则表达式，用于验证字符串的格式。
  multipleOf?: number, // 用于数值类型，指示数值必须是某个固定倍数。
  $ref?: string,
}