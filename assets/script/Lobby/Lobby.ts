import { _decorator, Component, director, Node } from 'cc';
import { GAME_EVENT, SCENE, SOUNDS_NAME } from '../constants/Constant';
import { GameManager } from '../managers/GameManager';
import { ResourcesManager } from '../managers/ResourcesManager';
const { ccclass, property } = _decorator;

@ccclass('Lobby')
export class Lobby extends Component {
    start() {

    }

    openGameplay(){
        director.emit(GAME_EVENT.SWITCH_SCENE,SCENE.GAMEPLAY);
        GameManager.Instance.PersistNodeRef.playEffect(
            ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.DEFAULT_CLICK)
          );
    }

    update(deltaTime: number) {
        
    }
}

