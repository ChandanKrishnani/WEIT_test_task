import { _decorator , Animation, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

import RootStatus from "../RootStatus";
import { PlayerActions } from "../PlayerStatusMachine";

@ccclass('AttackStatus')
export default class AttackStatus extends RootStatus {
    nAttackLevel: number = 1;
    bInAttackAnimation: boolean = false;
    onEnter() {
        this.bInAttackAnimation = true;
        this.spritePlayer.getComponent(Animation).play("player_attack" + this.nAttackLevel);
        this.nAttackLevel++;
        if (this.nAttackLevel > 3) {
        this.nAttackLevel = 1;
        }

        this.spritePlayer.getComponent(Animation).off(Animation.EventType.FINISHED, this.onAttackFinished, this)
        this.spritePlayer.getComponent(Animation).on(Animation.EventType.FINISHED, this.onAttackFinished, this)
    }
    onExit() {
        this.bInAttackAnimation = false;
        this.spritePlayer.getComponent(Animation).off(Animation.EventType.FINISHED, this.onAttackFinished, this)
        Tween.stopAllByTarget(this);
    }
    onUpdate(dt: number) {

    }
    onAttackFinished() {
        this.bInAttackAnimation = false;
        tween(this)
        .delay(0.2)
        .call(() => {
        this.nAttackLevel = 1;

        if (this.machine.mainPlayer.bPlayerInRunning) {
        this.machine.changeStatus(PlayerActions.move);
        }
        else {
        this.machine.changeStatus(PlayerActions.stand2);
        }
        })
        .start();
    }
}
