import { webview } from '@kit.ArkWeb'
import { buffer } from '@kit.ArkTS';

class HarmonyBridge {
  private callback?: (event: Object) => void

  public postMessage(event: Object) {
    console.log("Harmony receive web post event:", JSON.stringify(event))
    this.callback?.(event)
  }

  public onmessage(callback: (event: Object) => void) {
    console.log("Web set message callback")
    this.callback = callback
  }
}

@Entry
@Component
struct Index {
  controller: webview.WebviewController = new webview.WebviewController();
  localhost: string = "http://localhost/";
  harmonyBridge = new HarmonyBridge();

  getMimeType(path: string): string {
    let mimeType: string = '';
    if (path.endsWith(".html")) {
      mimeType = "text/html";
    } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
      mimeType = "application/javascript";
    } else if (path.endsWith(".wasm")) {
      mimeType = "application/wasm";
    } else if (path.endsWith(".css")) {
      mimeType = "text/css";
    } else if (path.endsWith(".svg")) {
      mimeType = "image/svg+xml";
    } else if (path.endsWith(".png")) {
      mimeType = "image/png";
    } else if (path.endsWith(".webp")) {
      mimeType = "image/webp";
    } else if (path.endsWith(".jpg")) {
      mimeType = "image/jpeg";
    }
    return mimeType;
  }

  build() {
    Column() {
      Web({ src: this.localhost, controller: this.controller })
        .javaScriptOnDocumentEnd([
          { script: this.getScriptString(), scriptRules: ["*"] }
        ])
        .javaScriptProxy({
          object: this.harmonyBridge,
          name: "harmonyBridge",
          methodList: ["postMessage", "onmessage"],
          controller: this.controller
        })
        .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
        .javaScriptAccess(true)
        .imageAccess(true)
        .fileAccess(true)
        .domStorageAccess(true)
        .geolocationAccess(true)
        .zoomAccess(false)
        .mixedMode(MixedMode.All)
        .verticalScrollBarAccess(false)
        .cacheMode(CacheMode.Default)
        .onInterceptRequest((event) => {
          let url = event?.request.getRequestUrl();
          console.log('onInterceptRequest url: ' + url)

          if (url.startsWith(this.localhost)) {
            let path = url.replace(this.localhost, 'public/');
            if (path === 'public/') {
              path += 'index.html';
            }
            console.log("rawfile path:", path);
            let response = new WebResourceResponse();
            let mimeType = this.getMimeType(path);
            response.setResponseData($rawfile(path));
            response.setResponseMimeType(mimeType);
            response.setResponseEncoding('utf-8');
            response.setResponseCode(200);
            response.setReasonMessage('OK');
            response.setResponseIsReady(true);
            response.setResponseHeader([
              { headerKey: 'Access-Control-Allow-Origin', headerValue: '*' },
              { headerKey: 'Connection', headerValue: 'keep-alive' },
              { headerKey: 'Cache-Control', headerValue: 'no-cache' },
            ]);

            return response;
          }

          return null;
        })
    }
  }

  getFilesContent(path: string): string {
    let context = getContext();
    let resourceManager = context.resourceManager;
    let data = resourceManager.getRawFileContentSync(path)
    return buffer.from(data).toString("utf-8");
  }

  getBridgeJS() {
    return this.getFilesContent('native-bridge.js')
  }

  getScriptString(): string {
    let bridgeJS = this.getBridgeJS();
    return bridgeJS
  }

  injectScriptString(html: string) {
    let js = "<script type=\"text/javascript\">" + this.getScriptString() + "</script>";
    return html.replace("<head>", "<head>" + js);
  }
}