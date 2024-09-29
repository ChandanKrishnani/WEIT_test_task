import { _decorator, Component, director, Node } from "cc";
import { GameResultType } from "../comman/PersistNode";
import FallStatus from "../StatusSrc/PlayerStatus/FallStatus";
import { GAME_EVENT, SCENE, SOUNDS_NAME } from "../constants/Constant";
import { GameManager } from "../managers/GameManager";
import { ResourcesManager } from "../managers/ResourcesManager";
const { ccclass, property } = _decorator;

@ccclass("GameEnd")
export class GameEndPopup extends Component {
  @property(Node)
  winLable: Node = null;

  @property(Node)
  looselable: Node = null;

  start() {}

  updatePopupStatus(status: GameResultType) {
    switch (status) {
      case GameResultType.PLAYER_LOSE:
        this.looselable.active = true;
        this.winLable.active = false;
        break;
      case GameResultType.PLAYER_WON:
        this.winLable.active = true;
        this.looselable.active = false;
        break;
    }
  }
  restartGame() {
    GameManager.Instance.PersistNodeRef.playEffect(
        ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.DEFAULT_CLICK)
      );
    director.emit(GAME_EVENT.SWITCH_SCENE, SCENE.GAMEPLAY);
    this.node.active = false;
  }

  backtoLobby() {
    GameManager.Instance.PersistNodeRef.playEffect(
        ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.DEFAULT_CLICK)
      );
    director.emit(GAME_EVENT.SWITCH_SCENE, SCENE.LOBBY);
    this.node.active = false;
  }

  update(deltaTime: number) {}
}
