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

import blog, {
  ArchivePage,
  DetailPgae,
  HomePage,
  Plugin, Schema
} from './index';

@HomePage.Injectable()
class MyHomePage extends HomePage {
  public async state(page: number, type: string, category: number) {
    return {
      value: 'home',
      page, type, category,
    }
  }

  public render(data: ReturnType<MyHomePage['state']> extends Promise<infer U> ? U : never) {
    return `<script>var INITIALZIE = ${JSON.stringify(data)}</script><body>hello</body>`
  }
}

@DetailPgae.Injectable()
class MyDetailPgae extends DetailPgae {
  public state(page: number, token: string) {
    return {
      value: 'detail',
      page, token
    }
  }

  public render(data: ReturnType<MyDetailPgae['state']> extends Promise<infer U> ? U : never) {
    return `<script>var INITIALZIE = ${JSON.stringify(data)}</script><body>hello</body>`
  }
}

@ArchivePage.Injectable()
class MyArchivePage extends ArchivePage {
  public state(page: number) {
    return {
      value: 'archive',
      page
    }
  }

  public render(data: ReturnType<MyArchivePage['state']> extends Promise<infer U> ? U : never) {
    return `<script>var INITIALZIE = ${JSON.stringify(data)}</script><body>hello</body>`
  }
}

@Plugin.Injectable()
class CommonPlugin extends Plugin<{ a: number }> {
  public readonly cwd: string = process.cwd();
  public readonly code: string = 'xxxxxxxxx';
  public readonly version: string = '1.0.1';
  public readonly name: string = 'pjblog-theme-default';
  public readonly description: string = 'desc';
  public readonly readme: string = 'readme';
  public readonly schema = new Schema.Object().set('a', new Schema.Number());

  public async initialize() {
    await this.$theme('home', MyHomePage);
    await this.$theme('detail', MyDetailPgae);
    await this.$theme('archive', MyArchivePage);
  };
}

blog({
  http: {
    port: 3000,
  },
  cache: {
    type: 'redis',
  },
  database: {
    "type": "mysql",
    "host": "127.0.0.1",
    "port": 3306,
    "username": "root",
    "password": "fdnsyj211314",
    "database": "npm"
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  }
}, [CommonPlugin])