import { _decorator , Animation } from 'cc';
const { ccclass, property } = _decorator;

import RootStatus from "../RootStatus";
import { PlayerActions } from "../PlayerStatusMachine";

@ccclass('FallStatus')
export default class FallStatus extends RootStatus {
    onEnter() {
        this.spritePlayer.getComponent(Animation).play("player_fall");
    }
    onExit() {
    }
    onUpdate(dt: number) {

    }
}

