import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class McpPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('Pipe transform value:', value)

    return value
  }
}
