import { _decorator, Node } from 'cc';
import { PlayerStatusMachine } from "./PlayerStatusMachine";

export default class RootStatus {
    machine: PlayerStatusMachine = null;
    spritePlayer: Node | null = null;
    constructor(ower: PlayerStatusMachine, spritePlayer: Node) {
        this.machine = ower;
        this.spritePlayer = spritePlayer;
    }
    onEnter() {

    }
    onUpdate(dt: number) {

    }
    onExit() {

    }
}