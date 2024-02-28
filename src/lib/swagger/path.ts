import { Group } from "./group";
import { Request } from "./request";
import { Response } from "./response";
import { SchemaBase } from "../schema/base";
import { SwaggerConsumesMIME, SwaggerOperation, SwaggerParameter, SwaggerProducesMIME } from "./types";

export class Path {
  private _summary: string;
  private _description: string;
  private _deprecated = false;
  private readonly _consumes = new Set<SwaggerConsumesMIME>();
  private readonly _produces = new Set<SwaggerProducesMIME>();
  private readonly _parameters = new Set<Request>();
  private readonly _response = new Set<Response>();
  constructor(
    public readonly group: Group,
    public readonly method: string,
    public readonly url: string,
  ) {
    this.method = method.toLowerCase();
  }

  public addDefinition<T extends SchemaBase>(name: string, schema: T) {
    return this.group.addDefinition(name, schema);
  }

  public summary(_: string) {
    this._summary = _;
    return this;
  }

  public description(_: string) {
    this._description = _;
    return this;
  }

  public deprecated() {
    this._deprecated = true;
  }

  public consumes(...args: SwaggerConsumesMIME[]) {
    args.forEach(arg => this._consumes.add(arg));
    return this;
  }

  public produces(...args: SwaggerProducesMIME[]) {
    args.forEach(arg => this._produces.add(arg));
    return this;
  }

  public addParameter(name: string, desc?: string) {
    const request = new Request(name, desc);
    this._parameters.add(request);
    return request;
  }

  public addResponse(status: number, desc?: string) {
    const response = new Response(status, desc);
    this._response.add(response);
    return response;
  }

  private getParameters(): SwaggerParameter[] {
    return Array.from(this._parameters.values()).map(request => request.toJSON());
  }

  private getResponse(): SwaggerOperation['responses'] {
    const res: SwaggerOperation['responses'] = {}
    for (const response of this._response.values()) {
      res[response.status] = response.toJSON();
    }
    return res;
  }

  public toJSON(): SwaggerOperation {
    const consumes = Array.from(this._consumes.values());
    const produces = Array.from(this._produces.values());
    return {
      tags: this.group.namespace,
      summary: this._summary,
      deprecated: this._deprecated,
      description: this._description,
      consumes: consumes.length ? consumes : undefined,
      produces: produces.length ? produces : undefined,
      parameters: this.getParameters(),
      responses: this.getResponse(),
    }
  }
}