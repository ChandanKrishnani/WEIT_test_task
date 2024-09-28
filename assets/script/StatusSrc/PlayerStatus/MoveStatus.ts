import { _decorator, Animation } from 'cc';
const {ccclass, property} = _decorator;

import RootStatus from "../RootStatus";
import {PlayerActions} from "../PlayerStatusMachine";

@ccclass('MoveStatus')
export default class MoveStatus extends RootStatus
{
    onEnter()
    {       
        this.spritePlayer.getComponent(Animation).play("player_run");
    }
    onExit()
    {
    }
    onUpdate(dt: number)
    {
    }
}
