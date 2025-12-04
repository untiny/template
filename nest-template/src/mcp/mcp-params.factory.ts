import { ParamData } from '@nestjs/common'
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum'
import { ParamsFactory } from '@nestjs/core'

export class McpParamsFactory implements ParamsFactory {
  exchangeKeyForValue(type: number, data: ParamData, args: any) {
    switch (type as RouteParamtypes) {
      case RouteParamtypes.REQUEST:
        return args[0]
      case RouteParamtypes.RESPONSE:
        return args[1]
      default:
        return null
    }
  }
}
