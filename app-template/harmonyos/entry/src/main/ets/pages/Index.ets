import { bridge } from '../capacitor-harmony/Bridge'

@Entry
@Component
struct Index {
  build() {
    Column() {
      Web({ src: "http://192.168.10.170:5173/", controller: bridge.webviewController })
        .javaScriptProxy(bridge.javaScriptProxy)
        .javaScriptOnDocumentStart(bridge.injectorScripts)
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
    }
  }
}