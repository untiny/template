import { CapacitorPlugin } from '../decorators/CapacitorPlugin';
import { JavascriptInterface } from '../decorators/JavascriptInterface';
import { PluginMethod } from '../decorators/PluginMethod';
import Logger from '../Logger';
import Plugin from '../Plugin';
import PluginCall from '../PluginCall';
import PluginConfig from '../PluginConfig';
import { Any } from '../Type';
import { BusinessError } from '@kit.BasicServicesKit';
import { http } from '@kit.NetworkKit';

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
  headers?: Record<string, string>;

  /**
   * The response URL recieved from the Http response.
   */
  url: string;
}

export enum ResponseType {
  ARRAY_BUFFER = "arraybuffer",
  BLOB = "blob",
  DOCUMENT = "document",
  JSON = "json",
  TEXT = "text",
}

@CapacitorPlugin()
export default class CapacitorHttp extends Plugin {
  private http(call: PluginCall, httpMethod?: http.RequestMethod) {
    let url = call.getString("url", "") as string;
    let headers = call.getObject("headers", {}) as Object;
    let params = call.getObject("params", {});
    let connectTimeout = call.getNumber("connectTimeout");
    let readTimeout = call.getNumber("readTimeout");
    let disableRedirects = call.getBoolean("disableRedirects");
    let shouldEncode = call.getBoolean("shouldEncodeUrlParams", true);
    let responseType = call.getString("responseType", ResponseType.TEXT);
    if (!Object.values(ResponseType).includes(responseType as ResponseType)) {
      responseType = ResponseType.TEXT
    }
    let dataType = call.getString("dataType");
    let method = httpMethod ?? call.getString("method", http.RequestMethod.GET) as http.RequestMethod;

    let isHttpMutate =
      method === http.RequestMethod.DELETE || method === http.RequestMethod.POST || method === http.RequestMethod.PUT;

    let httpRequest = http.createHttp();
    httpRequest.request(
      url,
      {
        header: headers,
        connectTimeout,
        readTimeout,
        // expectDataType: dataType,
        extraData: params,
      },
      (err: BusinessError, data: http.HttpResponse) => {
        Logger.debug("CapacitorHttp", JSON.stringify(data))
        if (!err) {
          // data.result为HTTP响应内容，可根据业务需要进行解析
          console.info('Result:' + JSON.stringify(data.result));
          console.info('code:' + JSON.stringify(data.responseCode));
          // data.header为HTTP响应头，可根据业务需要进行解析
          console.info('header:' + JSON.stringify(data.header));
          console.info('cookies:' + JSON.stringify(data.cookies)); // 8+
          // 当该请求使用完毕时，调用destroy方法主动销毁
          httpRequest.destroy();
          let response: HttpResponse = {
            data: data.result,
            status: data.responseCode,
            url,
            headers: data.header as Record<string, string>
          }
          call.resolve(response);
        } else {
          console.error('error:' + JSON.stringify(err));
          // 取消订阅HTTP响应头事件
          httpRequest.off('headersReceive');
          // 当该请求使用完毕时，调用destroy方法主动销毁
          httpRequest.destroy();
          call.reject(err.message, err.name)
        }
      }
    )
  }

  @JavascriptInterface()
  public isEnabled(): boolean {
    let pluginConfig: PluginConfig = this.getBridge()?.getConfig().getPluginConfiguration("CapacitorHttp");
    return pluginConfig.getBoolean("enabled", false);
  }

  @PluginMethod()
  public request(call: PluginCall): void {
    this.http(call);
  }

  @PluginMethod()
  public get(call: PluginCall): void {
    this.http(call, http.RequestMethod.GET);
  }

  @PluginMethod()
  public post(call: PluginCall): void {
    this.http(call, http.RequestMethod.POST);
  }

  @PluginMethod()
  public put(call: PluginCall): void {
    this.http(call, http.RequestMethod.PUT);
  }

  @PluginMethod()
  public patch(call: PluginCall): void {
    this.http(call, http.RequestMethod.POST);
  }

  @PluginMethod()
  public delete(call: PluginCall): void {
    this.http(call, http.RequestMethod.DELETE);

  }
}