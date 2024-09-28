import { _decorator, Animation } from 'cc';
const {ccclass, property} = _decorator;

import RootStatus from "../RootStatus";
import {PlayerActions} from "../PlayerStatusMachine";

@ccclass('JumpStatus')
export default class JumpStatus extends RootStatus
{
    fJumpTime:number = 0;
    onEnter()
    {
        this.fJumpTime = 0;
        this.spritePlayer.getComponent(Animation).play("player_jump");
    }
    onExit()
    {
        this.fJumpTime = 0;
    }
    onUpdate(dt: number)
    {
    }
}
