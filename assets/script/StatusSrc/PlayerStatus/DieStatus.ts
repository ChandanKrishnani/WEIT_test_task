import { _decorator, Component, Node, tween } from "cc";
import RootStatus from "../RootStatus";
const { ccclass, property } = _decorator;

@ccclass("DieStatus")
export class DieStatus extends RootStatus {
  onEnter() {
    this.machine.mainPlayer.nPlayerRunSpeed = 0;
    tween(this.spritePlayer).to(0.5, { angle: 90 }).start();
  }
  onExit() {}
  onUpdate(dt: number) {}
}
