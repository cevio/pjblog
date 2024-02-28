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

import dayjs from 'dayjs';
import winston, { format } from 'winston';
import WinstonDailyFiler from 'winston-daily-rotate-file';
import { Component } from '@zille/core';
import { Env } from './env.app';
import { resolve } from 'node:path';

@Component.Injectable()
export class Logger extends Component {
  @Component.Inject(Env)
  private readonly Env: Env;

  private current: winston.Logger;

  public info(msg: string) {
    return this.current?.info(msg);
  }

  public error(msg: string) {
    return this.current?.error(msg);
  }

  public warn(msg: string) {
    return this.current?.warn(msg);
  }

  public help(msg: string) {
    return this.current?.help(msg);
  }

  public data(msg: string) {
    return this.current?.data(msg);
  }

  public debug(msg: string) {
    return this.current?.debug(msg);
  }

  public prompt(msg: string, ...meta: any[]) {
    return this.current?.prompt(msg, ...meta);
  }

  public http(msg: string, ...meta: any[]) {
    return this.current?.http(msg, ...meta);
  }

  public input(msg: string, ...meta: any[]) {
    return this.current?.input(msg, ...meta);
  }

  public silly(msg: string, ...meta: any[]) {
    return this.current?.silly(msg, ...meta);
  }

  public emerg(msg: string, ...meta: any[]) {
    return this.current?.emerg(msg, ...meta);
  }

  public alert(msg: string, ...meta: any[]) {
    return this.current?.alert(msg, ...meta);
  }

  public crit(msg: string, ...meta: any[]) {
    return this.current?.crit(msg, ...meta);
  }

  public warning(msg: string, ...meta: any[]) {
    return this.current?.warning(msg, ...meta);
  }

  public notice(msg: string, ...meta: any[]) {
    return this.current?.notice(msg, ...meta);
  }

  public initialize() {
    this.current = winston.createLogger({
      level: 'debug',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: format.combine(
            format.timestamp(),
            format.colorize(),
            format.printf(({ level, message, timestamp }) => {
              return `[${dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}] ${level}: ${message}`;
            })
          ),
        }),
        new WinstonDailyFiler({
          filename: resolve(this.Env.cwd, 'logs', '%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
          utc: true,
        }),
      ],
    })
  }

  public terminate() {
    this.current.destroy();
  }
}