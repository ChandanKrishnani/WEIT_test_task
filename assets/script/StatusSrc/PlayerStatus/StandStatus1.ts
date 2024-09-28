import { _decorator , Animation } from 'cc';
const { ccclass, property } = _decorator;

import RootStatus from "../RootStatus";
import { PlayerStatusMachine } from "../PlayerStatusMachine";

@ccclass('StandStatus1')
export default class StandStatus1 extends RootStatus {
    onEnter() {
        this.spritePlayer.getComponent(Animation).play("player_stand1");
    }
    onExit() {
    }
    onUpdate(dt: number) {

    }
}