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

import { HttpProps } from '@zille/http';
import { Context } from 'koa';
import { DataSource, QueryRunner } from 'typeorm';

export type DataBaseConnection = DataSource | QueryRunner;

export interface BlogProps {
  cache: {
    type: 'file' | 'redis',
    directory?: string,
  }
  database: BlogDataBaseProps,
  redis?: BlogRedisProps,
  http: HttpProps,
}

export interface BlogDataBaseProps {
  type: 'mssql' | 'mysql' | 'oracle' | 'postgres',
  host: string,
  port: number,
  username?: string,
  password?: string,
  database: string,
  entityPrefix?: string,
}

export interface BlogRedisProps {
  host: string,
  port: number,
  password?: string,
  db?: number,
}

export type ExtractParamsFromString<T extends string> = T extends `${string}[${infer Param}:${infer Type}]${infer Rest}`
  ? {
    [Key in Param & string]: Type extends 'string'
    ? string
    : Type extends 'number'
    ? number
    : Type extends 'boolean'
    ? boolean
    : never
  } & ExtractParamsFromString<Rest>
  : {};


export interface SystemConfigs {
  theme: string,
  title: string,
  description: string,
  domain: string,
  icp: string,
  keywords: string[],
  bodyJSONLimit: number,
  bodyFORMLimit: number,
  close: boolean,
  closeReason: string,
  swagger: boolean,
  registable: boolean,
  loginExpire: number,
  onlineExpire: number,
  sessionMaxAge: number,
  mediaQueryWithPageSize: number,
  mediaLatestWithSize: number,
  mediaHotWithSize: number,
  mediaCommentable: boolean,
  mediaCommentWithLatestSize: number,
  mediaCommentWithPageSize: number,
  mediaRelativeWithPageSize: number,
  mediaCommentWithChildrenPageSize: number,
}

export interface LoginsProps {
  id: string,
  name: string,
  description: string,
  version: string,
  icon?: string,
  redirect(ctx: Context, redirect_url?: string): unknown | Promise<unknown>,
}