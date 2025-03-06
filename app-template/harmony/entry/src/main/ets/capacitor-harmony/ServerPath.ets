export enum PathType {
  BASE_PATH,
  ASSET_PATH
}

export default class ServerPath {
  private type: PathType;
  private path: string;

  constructor(type: PathType, path: string) {
    this.type = type;
    this.path = path;
  }

  public getType() {
    return this.type;
  }

  public getPath() {
    return this.path;
  }
}