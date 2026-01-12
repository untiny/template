import { isEmpty, isObject, isString } from 'lodash'
import { createParamDecorator } from './create-param-metadata.decorator'

export const Param = createParamDecorator((key, ctx) => {
  if (isEmpty(key) || !isString(key)) {
    return ctx.params
  }
  if (isObject(ctx.params)) {
    return ctx.params[key]
  }
  return null
})
