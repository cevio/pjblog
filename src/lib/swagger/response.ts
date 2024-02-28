import { SchemaBase } from "../schema/base";
import { SwaggerResponse } from "./types";

export class Response {
  private _schema: SchemaBase;
  constructor(
    public readonly status: number,
    private readonly description?: string,
  ) { }

  public schema(_: SchemaBase) {
    this._schema = _;
    return this;
  }

  public toJSON(): SwaggerResponse {
    return {
      description: this.description,
      schema: this._schema?.toJSON(),
    }
  }
}