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
import { MimeType } from './util/MimeType';

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
  public load() {
    // this.bridge?.webviewController.registerJavaScriptProxy(this, 'CapacitorHttpAndroidInterface', ["isEnabled"])
    super.load();
  }

  private getExpectDataType(responseType: ResponseType): http.HttpDataType {
    console.log("responseType", responseType)
    switch (responseType) {
      case ResponseType.ARRAY_BUFFER:
        return http.HttpDataType.ARRAY_BUFFER;
      case ResponseType.BLOB:
      case ResponseType.JSON:
        return http.HttpDataType.OBJECT;
      case ResponseType.TEXT:
      case ResponseType.DOCUMENT:
        return http.HttpDataType.STRING;
    }
  }

  private http(call: PluginCall, httpMethod?: http.RequestMethod) {
    let url = call.getString("url", "") as string;
    let headers = call.getObject("headers", {}) as Object;
    let params = call.getObject("params", {}) as Record<string, string>;
    let data = call.getObject("data", {}) as Record<string, Any>;
    let connectTimeout = call.getNumber("connectTimeout") as number;
    let readTimeout = call.getNumber("readTimeout") as number;
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

    let expectDataType = this.getExpectDataType(responseType as ResponseType);

    let options: http.HttpRequestOptions = {
      method,
      header: headers,
      connectTimeout,
      readTimeout,
      expectDataType,
      extraData: isHttpMutate ? data : params
    }

    Logger.debug("CapacitorHttp", JSON.stringify({ url, options }))

    let httpRequest = http.createHttp();
    httpRequest.request(
      url,
      options,
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
          let contentType = data.header["content-type"] as string;
          if (
            contentType && typeof data.result === 'string' &&
            this.isOneOf(contentType, [MimeType.APPLICATION_JSON, MimeType.APPLICATION_VND_API_JSON])
          ) {
            data.result = JSON.parse(data.result);
          }
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

  private isOneOf(contentType: string, mimeTypes: MimeType[]) {
    return mimeTypes.some(mimeType => contentType.includes(mimeType))
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
    call.unimplemented();
  }

  @PluginMethod()
  public delete(call: PluginCall): void {
    this.http(call, http.RequestMethod.DELETE);

  }
}