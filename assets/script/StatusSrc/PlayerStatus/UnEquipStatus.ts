import { _decorator , Animation } from 'cc';
const { ccclass, property } = _decorator;

import RootStatus from "../RootStatus";
import { PlayerActions, PlayerStatusMachine } from "../PlayerStatusMachine";

@ccclass('UnEquipStatus')
export default class UnEquipStatus extends RootStatus {
    onEnter() {
        this.spritePlayer.getComponent(Animation).play("player_unequip");

        this.spritePlayer.getComponent(Animation).off(Animation.EventType.FINISHED, this.onUnEquipFinished, this)
        this.spritePlayer.getComponent(Animation).on(Animation.EventType.FINISHED, this.onUnEquipFinished, this)
    }
    onExit() {
        this.spritePlayer.getComponent(Animation).off(Animation.EventType.FINISHED, this.onUnEquipFinished, this)
    }
    onUpdate(dt: number) {

    }
    onUnEquipFinished() {
        this.machine.changeStatus(PlayerActions.stand1)
    }
}
