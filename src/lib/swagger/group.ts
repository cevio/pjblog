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

import { Path } from "./path";
import { SchemaBase } from "../schema/base";
import { SwaggerPath, SwaggerSpec, SwaggerTag } from "./types";

export class Group {
  private readonly children = new Set<Group>();
  private readonly definitions = new Map<string, SchemaBase>();
  private readonly paths = new Set<Path>();
  constructor(
    public readonly parent?: Group,
    public readonly name?: string,
    public readonly description?: string,
  ) { }

  get namespace(): string[] {
    return (
      !this.parent
        ? [this.name]
        : this.parent.namespace.concat([this.name])
    ).filter(Boolean);
  }

  public addDefinition<T extends SchemaBase>(name: string, schema: T) {
    const key = this.namespace.concat([name]).join('.');
    this.definitions.set(key, schema);
    return [
      `#/definitions/${key}`,
      () => this.definitions.delete(key),
    ] as const;
  }

  public getDefinitions(): SwaggerSpec['definitions'] {
    const definitions: SwaggerSpec['definitions'] = {};
    for (const [key, schema] of this.definitions.entries()) {
      definitions[key] = schema.toJSON();
    }
    return Array.from(this.children.values())
      .map(children => children.getDefinitions())
      .reduce((prev, next) => Object.assign(prev, next), definitions);
  }

  public addGroup(group: Group) {
    this.children.add(group);
    return this;
  }

  public delGroup(group: Group) {
    if (this.children.has(group)) {
      this.children.delete(group);
    }
    return this;
  }

  public createGroup(name: string, description?: string) {
    const group = new Group(this, name, description);
    this.addGroup(group);
    return [
      group,
      () => this.delGroup(group)
    ] as const;
  }

  public getTags(): SwaggerTag[] {
    const current: [SwaggerTag?] = this.name ? [{
      name: this.name,
      description: this.description,
    }] : [];
    return Array.from(this.children.values())
      .map(group => group.getTags())
      .reduce((prev, next) => prev.concat(next), current);
  }

  public getPaths(): SwaggerPath {
    const paths: SwaggerPath = {};
    for (const path of this.paths.values()) {
      const url = path.url;
      const method = path.method;
      if (!paths[url]) {
        paths[url] = {}
      }
      paths[url][method] = path.toJSON();
    }

    return Array.from(this.children.values())
      .map(group => group.getPaths())
      .reduce((prev, next) => {
        for (const key in next) {
          const value = next[key];
          if (!prev[key]) {
            prev[key] = value;
          } else {
            for (const method in value) {
              prev[key][method] = value[method];
            }
          }
        }
        return prev;
      }, paths);

  }

  public createPath(method: string, url: string) {
    const path = new Path(this, method, url);
    this.paths.add(path);
    return [
      path,
      () => this.paths.delete(path),
    ] as const;
  }
}