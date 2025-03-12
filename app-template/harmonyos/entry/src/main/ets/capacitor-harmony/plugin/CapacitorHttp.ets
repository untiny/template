import { CapacitorPlugin } from '../decorators/CapacitorPlugin';
import { PluginMethod } from '../decorators/PluginMethod';
import Logger from '../Logger';
import Plugin from '../Plugin';
import PluginCall from '../PluginCall';
import { Any } from '../Type';

export interface HttpResponse {
  /**
   * Additional data received with the Http response.
   */
  data: Any;

  /**
   * The status code received from the Http response.
   */
  status: number;

  /**
   * The headers received from the Http response.
   */
  headers?: Record<string, Any>;

  /**
   * The response URL recieved from the Http response.
   */
  url: string;
}

@CapacitorPlugin()
export default class CapacitorHttp extends Plugin {
  @PluginMethod()
  public request(call: PluginCall): void {
  }

  @PluginMethod()
  public get(call: PluginCall): void {
    Logger.debug("雅蠛蝶")

    let data: HttpResponse = {
      data: "斯国一",
      status: 200,
      url: call.getString("url") as string,
    }
    call.resolve(data)
  }

  @PluginMethod()
  public post(call: PluginCall): void {
  }

  @PluginMethod()
  public put(call: PluginCall): void {
  }

  @PluginMethod()
  public patch(call: PluginCall): void {
  }

  @PluginMethod()
  public delete(call: PluginCall): void {
  }
}