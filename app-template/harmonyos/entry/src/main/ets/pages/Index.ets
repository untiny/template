import { bridge } from '../capacitor-harmony/Bridge';
import { webview } from '@kit.ArkWeb';

@Entry
@Component
struct Index {
  aboutToAppear(): void {
    webview.WebviewController.setWebDebuggingAccess(true);
  }

  build() {
    Column() {
      Web({ src: bridge.getLocalUrl(), controller: bridge.webviewController })
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
        .onInterceptRequest(bridge.onInterceptRequest)
    }
  }

  onBackPress(): boolean | void {
    bridge.onBackPressed();
    return true;
  }
}