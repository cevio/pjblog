const { glob } = require('glob');
const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');

const code = `/**
 * Copyright (c) PJBlog Platforms, net. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author evio<evio@vip.qq.com>
 * @Website https://www.pjhome.net
 */

'use strict';

`;

(async () => {
  const directory = resolve(__dirname, '../src');
  const files = await glob(`**/*.ts`, { cwd: directory });
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filepath = resolve(directory, file);
    const content = readFileSync(filepath, 'utf8');
    if (!content.startsWith(code)) {
      writeFileSync(filepath, code + content, 'utf8');
      console.log('-', filepath);
    }
  }
})();