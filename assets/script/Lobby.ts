import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Lobby')
export class Lobby extends Component {
    start() {

    }

    openGameplay(){
        director.loadScene("Game");
    }

    update(deltaTime: number) {
        
    }
}

