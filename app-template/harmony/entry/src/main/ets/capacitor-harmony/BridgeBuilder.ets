import { UIAbility } from "@kit.AbilityKit";

export default class BridgeBuilder {
  private ability: UIAbility

  constructor(ability: UIAbility) {
    this.ability = ability;
  }
}