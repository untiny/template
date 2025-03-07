// Begin: Capacitor Plugin JS
(function (w) {
  var a = (w.Capacitor = w.Capacitor || {});
  var p = (a.Plugins = a.Plugins || {});
  var t = (p["App"] = {});
  t.addListener = function (eventName, callback) {
    return w.Capacitor.addListener("App", eventName, callback);
  };
  t["getState"] = function (_options) {
    return w.Capacitor.nativePromise("App", "getState", _options);
  };
  t["getInfo"] = function (_options) {
    return w.Capacitor.nativePromise("App", "getInfo", _options);
  };
  t["removeAllListeners"] = function (_options) {
    return w.Capacitor.nativePromise("App", "removeAllListeners", _options);
  };
  t["getLaunchUrl"] = function (_options) {
    return w.Capacitor.nativePromise("App", "getLaunchUrl", _options);
  };
  t["checkPermissions"] = function (_options) {
    return w.Capacitor.nativePromise("App", "checkPermissions", _options);
  };
  t["requestPermissions"] = function (_options) {
    return w.Capacitor.nativePromise("App", "requestPermissions", _options);
  };
  t["exitApp"] = function (_options) {
    return w.Capacitor.nativePromise("App", "exitApp", _options);
  };
  t["minimizeApp"] = function (_options) {
    return w.Capacitor.nativePromise("App", "minimizeApp", _options);
  };
})(window);

(function (w) {
  var a = (w.Capacitor = w.Capacitor || {});
  var p = (a.Plugins = a.Plugins || {});
  var t = (p["SafeArea"] = {});
  t.addListener = function (eventName, callback) {
    return w.Capacitor.addListener("SafeArea", eventName, callback);
  };
  t["removeAllListeners"] = function (_options) {
    return w.Capacitor.nativePromise(
      "SafeArea",
      "removeAllListeners",
      _options
    );
  };
  t["getStatusBarHeight"] = function (_options) {
    return w.Capacitor.nativePromise(
      "SafeArea",
      "getStatusBarHeight",
      _options
    );
  };
  t["checkPermissions"] = function (_options) {
    return w.Capacitor.nativePromise("SafeArea", "checkPermissions", _options);
  };
  t["requestPermissions"] = function (_options) {
    return w.Capacitor.nativePromise(
      "SafeArea",
      "requestPermissions",
      _options
    );
  };
  t["getSafeArea"] = function (_options) {
    return w.Capacitor.nativePromise("SafeArea", "getSafeArea", _options);
  };
})(window);

(function (w) {
  var a = (w.Capacitor = w.Capacitor || {});
  var p = (a.Plugins = a.Plugins || {});
  var t = (p["Keyboard"] = {});
  t.addListener = function (eventName, callback) {
    return w.Capacitor.addListener("Keyboard", eventName, callback);
  };
  t["getResizeMode"] = function (_options) {
    return w.Capacitor.nativePromise("Keyboard", "getResizeMode", _options);
  };
  t["setAccessoryBarVisible"] = function (_options) {
    return w.Capacitor.nativePromise(
      "Keyboard",
      "setAccessoryBarVisible",
      _options
    );
  };
  t["hide"] = function (_options) {
    return w.Capacitor.nativePromise("Keyboard", "hide", _options);
  };
  t["removeAllListeners"] = function (_options) {
    return w.Capacitor.nativePromise(
      "Keyboard",
      "removeAllListeners",
      _options
    );
  };
  t["checkPermissions"] = function (_options) {
    return w.Capacitor.nativePromise("Keyboard", "checkPermissions", _options);
  };
  t["requestPermissions"] = function (_options) {
    return w.Capacitor.nativePromise(
      "Keyboard",
      "requestPermissions",
      _options
    );
  };
  t["setResizeMode"] = function (_options) {
    return w.Capacitor.nativePromise("Keyboard", "setResizeMode", _options);
  };
  t["show"] = function (_options) {
    return w.Capacitor.nativePromise("Keyboard", "show", _options);
  };
  t["setStyle"] = function (_options) {
    return w.Capacitor.nativePromise("Keyboard", "setStyle", _options);
  };
  t["setScroll"] = function (_options) {
    return w.Capacitor.nativePromise("Keyboard", "setScroll", _options);
  };
})(window);

(function (w) {
  var a = (w.Capacitor = w.Capacitor || {});
  var p = (a.Plugins = a.Plugins || {});
  var t = (p["CapacitorCookies"] = {});
  t.addListener = function (eventName, callback) {
    return w.Capacitor.addListener("CapacitorCookies", eventName, callback);
  };
  t["deleteCookie"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorCookies",
      "deleteCookie",
      _options
    );
  };
  t["removeAllListeners"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorCookies",
      "removeAllListeners",
      _options
    );
  };
  t["clearCookies"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorCookies",
      "clearCookies",
      _options
    );
  };
  t["getCookies"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorCookies",
      "getCookies",
      _options
    );
  };
  t["checkPermissions"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorCookies",
      "checkPermissions",
      _options
    );
  };
  t["requestPermissions"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorCookies",
      "requestPermissions",
      _options
    );
  };
  t["clearAllCookies"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorCookies",
      "clearAllCookies",
      _options
    );
  };
  t["setCookie"] = function (_options) {
    return w.Capacitor.nativePromise("CapacitorCookies", "setCookie", _options);
  };
})(window);

(function (w) {
  var a = (w.Capacitor = w.Capacitor || {});
  var p = (a.Plugins = a.Plugins || {});
  var t = (p["WebView"] = {});
  t.addListener = function (eventName, callback) {
    return w.Capacitor.addListener("WebView", eventName, callback);
  };
  t["removeAllListeners"] = function (_options) {
    return w.Capacitor.nativePromise("WebView", "removeAllListeners", _options);
  };
  t["persistServerBasePath"] = function (_options) {
    return w.Capacitor.nativePromise(
      "WebView",
      "persistServerBasePath",
      _options
    );
  };
  t["checkPermissions"] = function (_options) {
    return w.Capacitor.nativePromise("WebView", "checkPermissions", _options);
  };
  t["requestPermissions"] = function (_options) {
    return w.Capacitor.nativePromise("WebView", "requestPermissions", _options);
  };
  t["setServerAssetPath"] = function (_options) {
    return w.Capacitor.nativePromise("WebView", "setServerAssetPath", _options);
  };
  t["setServerBasePath"] = function (_options) {
    return w.Capacitor.nativePromise("WebView", "setServerBasePath", _options);
  };
  t["getServerBasePath"] = function (_options) {
    return w.Capacitor.nativePromise("WebView", "getServerBasePath", _options);
  };
})(window);

(function (w) {
  var a = (w.Capacitor = w.Capacitor || {});
  var p = (a.Plugins = a.Plugins || {});
  var t = (p["StatusBar"] = {});
  t.addListener = function (eventName, callback) {
    return w.Capacitor.addListener("StatusBar", eventName, callback);
  };
  t["hide"] = function (_options) {
    return w.Capacitor.nativePromise("StatusBar", "hide", _options);
  };
  t["setBackgroundColor"] = function (_options) {
    return w.Capacitor.nativePromise(
      "StatusBar",
      "setBackgroundColor",
      _options
    );
  };
  t["setOverlaysWebView"] = function (_options) {
    return w.Capacitor.nativePromise(
      "StatusBar",
      "setOverlaysWebView",
      _options
    );
  };
  t["getInfo"] = function (_options) {
    return w.Capacitor.nativePromise("StatusBar", "getInfo", _options);
  };
  t["removeAllListeners"] = function (_options) {
    return w.Capacitor.nativePromise(
      "StatusBar",
      "removeAllListeners",
      _options
    );
  };
  t["checkPermissions"] = function (_options) {
    return w.Capacitor.nativePromise("StatusBar", "checkPermissions", _options);
  };
  t["requestPermissions"] = function (_options) {
    return w.Capacitor.nativePromise(
      "StatusBar",
      "requestPermissions",
      _options
    );
  };
  t["show"] = function (_options) {
    return w.Capacitor.nativePromise("StatusBar", "show", _options);
  };
  t["setStyle"] = function (_options) {
    return w.Capacitor.nativePromise("StatusBar", "setStyle", _options);
  };
})(window);

(function (w) {
  var a = (w.Capacitor = w.Capacitor || {});
  var p = (a.Plugins = a.Plugins || {});
  var t = (p["CapacitorHttp"] = {});
  t.addListener = function (eventName, callback) {
    return w.Capacitor.addListener("CapacitorHttp", eventName, callback);
  };
  t["patch"] = function (_options) {
    return w.Capacitor.nativePromise("CapacitorHttp", "patch", _options);
  };
  t["request"] = function (_options) {
    return w.Capacitor.nativePromise("CapacitorHttp", "request", _options);
  };
  t["post"] = function (_options) {
    return w.Capacitor.nativePromise("CapacitorHttp", "post", _options);
  };
  t["removeAllListeners"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorHttp",
      "removeAllListeners",
      _options
    );
  };
  t["get"] = function (_options) {
    return w.Capacitor.nativePromise("CapacitorHttp", "get", _options);
  };
  t["checkPermissions"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorHttp",
      "checkPermissions",
      _options
    );
  };
  t["requestPermissions"] = function (_options) {
    return w.Capacitor.nativePromise(
      "CapacitorHttp",
      "requestPermissions",
      _options
    );
  };
  t["delete"] = function (_options) {
    return w.Capacitor.nativePromise("CapacitorHttp", "delete", _options);
  };
  t["put"] = function (_options) {
    return w.Capacitor.nativePromise("CapacitorHttp", "put", _options);
  };
})(window);

/** PluginHeaders */
window.Capacitor.PluginHeaders = [
  {
    name: "App",
    methods: [
      { name: "getState", rtype: "promise" },
      { name: "getInfo", rtype: "promise" },
      { name: "removeAllListeners", rtype: "promise" },
      { name: "getLaunchUrl", rtype: "promise" },
      { name: "checkPermissions", rtype: "promise" },
      { name: "requestPermissions", rtype: "promise" },
      { name: "exitApp", rtype: "promise" },
      { name: "removeListener" },
      { name: "addListener" },
      { name: "minimizeApp", rtype: "promise" },
    ],
  },
  {
    name: "SafeArea",
    methods: [
      { name: "removeAllListeners", rtype: "promise" },
      { name: "getStatusBarHeight", rtype: "promise" },
      { name: "checkPermissions", rtype: "promise" },
      { name: "requestPermissions", rtype: "promise" },
      { name: "getSafeArea", rtype: "promise" },
      { name: "removeListener" },
      { name: "addListener" },
    ],
  },
  {
    name: "Keyboard",
    methods: [
      { name: "getResizeMode", rtype: "promise" },
      { name: "setAccessoryBarVisible", rtype: "promise" },
      { name: "hide", rtype: "promise" },
      { name: "removeAllListeners", rtype: "promise" },
      { name: "checkPermissions", rtype: "promise" },
      { name: "requestPermissions", rtype: "promise" },
      { name: "setResizeMode", rtype: "promise" },
      { name: "show", rtype: "promise" },
      { name: "setStyle", rtype: "promise" },
      { name: "removeListener" },
      { name: "setScroll", rtype: "promise" },
      { name: "addListener" },
    ],
  },
  {
    name: "CapacitorCookies",
    methods: [
      { name: "deleteCookie", rtype: "promise" },
      { name: "removeAllListeners", rtype: "promise" },
      { name: "clearCookies", rtype: "promise" },
      { name: "getCookies", rtype: "promise" },
      { name: "checkPermissions", rtype: "promise" },
      { name: "requestPermissions", rtype: "promise" },
      { name: "clearAllCookies", rtype: "promise" },
      { name: "setCookie", rtype: "promise" },
      { name: "removeListener" },
      { name: "addListener" },
    ],
  },
  {
    name: "WebView",
    methods: [
      { name: "removeAllListeners", rtype: "promise" },
      { name: "persistServerBasePath", rtype: "promise" },
      { name: "checkPermissions", rtype: "promise" },
      { name: "requestPermissions", rtype: "promise" },
      { name: "setServerAssetPath", rtype: "promise" },
      { name: "removeListener" },
      { name: "setServerBasePath", rtype: "promise" },
      { name: "addListener" },
      { name: "getServerBasePath", rtype: "promise" },
    ],
  },
  {
    name: "StatusBar",
    methods: [
      { name: "hide", rtype: "promise" },
      { name: "setBackgroundColor", rtype: "promise" },
      { name: "setOverlaysWebView", rtype: "promise" },
      { name: "getInfo", rtype: "promise" },
      { name: "removeAllListeners", rtype: "promise" },
      { name: "checkPermissions", rtype: "promise" },
      { name: "requestPermissions", rtype: "promise" },
      { name: "show", rtype: "promise" },
      { name: "setStyle", rtype: "promise" },
      { name: "removeListener" },
      { name: "addListener" },
    ],
  },
  {
    name: "CapacitorHttp",
    methods: [
      { name: "patch", rtype: "promise" },
      { name: "request", rtype: "promise" },
      { name: "post", rtype: "promise" },
      { name: "removeAllListeners", rtype: "promise" },
      { name: "get", rtype: "promise" },
      { name: "checkPermissions", rtype: "promise" },
      { name: "requestPermissions", rtype: "promise" },
      { name: "removeListener" },
      { name: "delete", rtype: "promise" },
      { name: "put", rtype: "promise" },
      { name: "addListener" },
    ],
  },
];
