import { CapacitorWebView } from '../capacitor-harmony/CapacitorWebView'

@Entry
@Component
struct Index {
  build() {
    Column() {
      CapacitorWebView()
    }
  }
}