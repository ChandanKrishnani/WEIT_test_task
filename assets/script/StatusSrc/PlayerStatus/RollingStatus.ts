import { _decorator , Animation } from 'cc';
const { ccclass, property } = _decorator;

import RootStatus from "../RootStatus";
import { PlayerActions, PlayerStatusMachine } from "../PlayerStatusMachine";

@ccclass('RollingStatus')
export default class RollingStatus extends RootStatus {
    onEnter() {
        this.spritePlayer.getComponent(Animation).play("player_roll");

        this.spritePlayer.getComponent(Animation).off(Animation.EventType.FINISHED, this.onRollFinished, this)
        this.spritePlayer.getComponent(Animation).on(Animation.EventType.FINISHED, this.onRollFinished, this)
    }
    onExit() {
        this.spritePlayer.getComponent(Animation).off(Animation.EventType.FINISHED, this.onRollFinished, this)
        this.machine.mainPlayer.nPlayerRunSpeed = 2;
    }
    onUpdate(dt: number) {

    }
    onRollFinished() {
        if (this.machine.mainPlayer.bPlayerInRunning) {
        this.machine.changeStatus(PlayerActions.move);
        }
        else {
        this.machine.changeStatus(PlayerActions.stand1);
        }
    }
}
