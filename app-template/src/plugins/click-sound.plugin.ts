import { registerPlugin } from '@capacitor/core'

export interface ClickSoundPlugin {
  play: () => Promise<void>
}

export const ClickSound = registerPlugin<ClickSoundPlugin>('ClickSound', {
  web: {
    play: () => {
      // eslint-disable-next-line no-console
      console.log('哟西')
    },
  },
})
