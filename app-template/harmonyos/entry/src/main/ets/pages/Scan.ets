import { MyRect, ScanCustomPage, WrapperDecodeResult } from '@mpaas/scanapp'

@Entry({ routeName: 'Scancode' })
@Component
struct Scancode {
  build() {
    RelativeContainer() {
      ScanCustomPage({
        customUi: true,
        jumpToAlbum: false,
        flashIsOn:false
      })
    }
  }
}