import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { AiController } from './ai.controller'
import { AiExplorer } from './ai.explorer'
import { AiService } from './ai.service'
import { AiTool } from './ai.tool'
import { AiContextCreator } from './ai-context.creator'

@Module({
  imports: [DiscoveryModule],
  controllers: [AiController],
  providers: [AiService, AiExplorer, AiContextCreator, AiTool],
})
export class AiModule implements OnApplicationBootstrap {
  constructor(private readonly explorer: AiExplorer) {}

  onApplicationBootstrap() {
    this.explorer.explore()
  }
}
