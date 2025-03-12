import Bridge from './Bridge';
import { HashMap } from '@kit.ArkTS';


@Entry
@Component
export struct CapacitorWebView {
  @StorageProp('bridge') bridge: Bridge | null = null;

  aboutToAppear(): void {
    console.log(this.bridge?.msgHandler ? '十三少' : '1111')
    let map = new HashMap<string, number>();
    for (let index = 0; index < 10; index++) {
      map.set(String(index), index+1)

    }

    map.forEach(index => {
      console.log("Index:", index)
    })
  }

  build() {
    Column() {
      Web({ src: this.bridge?.getLocalUrl(), controller: this.bridge?.getWebviewController() })
        .javaScriptProxy({
          object: this.bridge?.msgHandler,
          name: "harmonyBridge",
          methodList: ["postMessage", "onmessage"],
          controller: this.bridge?.webviewController
        })
        .javaScriptOnDocumentStart(this.bridge?.getJSInjector(getContext()).getScripts())
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
      // .onInterceptRequest(this.bridge?.onInterceptRequest)
    }
  }
}