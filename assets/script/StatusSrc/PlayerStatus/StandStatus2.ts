import { _decorator , Animation } from 'cc';
const { ccclass, property } = _decorator;

import RootStatus from "../RootStatus";
import { PlayerActions } from "../PlayerStatusMachine";

@ccclass('StandStatus2')
export default class StandStatus2 extends RootStatus {
    fStandTime: number = 0;
    onEnter() {
        this.fStandTime = 0;
        this.spritePlayer.getComponent(Animation).play("player_stand2");
    }
    onExit() {
        this.fStandTime = 0;
    }
    onUpdate(dt: number) {
        this.fStandTime += dt;
        if (this.fStandTime >= 1) {
        this.machine.changeStatus(PlayerActions.unEquip);
        }
    }
}
