import { Application } from "@zille/application";
import { BlogVariable } from "./variable.app";
import { Newable } from "@zille/http-controller";
import { Exception } from "../lib/exception";
import { AcceptWebPageNameSpace } from "../global.types";

@Application.Injectable()
export class Themes extends Application {
  @Application.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  private readonly stacks = new Map<string, Map<AcceptWebPageNameSpace, Newable>>();

  get current() {
    const name = this.configs?.get('theme');
    if (!name || !this.stacks.has(name)) throw new Exception(400, '找不到主题');
    return this.stacks.get(name);
  }

  public setup() { }

  public add(plugin: string, name: AcceptWebPageNameSpace, theme: Newable) {
    if (!this.stacks.has(plugin)) {
      this.stacks.set(plugin, new Map());
    }
    this.stacks.get(plugin).set(name, theme);
    return this;
  }

  public del(name: string) {
    if (this.stacks.has(name)) {
      this.stacks.delete(name);
    }
    return this;
  }
}