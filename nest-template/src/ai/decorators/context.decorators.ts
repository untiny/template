import { isEmpty, isString } from 'lodash'
import { createParamDecorator } from './create-param-metadata.decorator'

export const Context = createParamDecorator((key, ctx) => {
  if (isEmpty(key) || !isString(key)) {
    return ctx.params
  }
  return ctx[key]
})
