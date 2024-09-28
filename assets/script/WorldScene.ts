import {
  _decorator,
  Component,
  Camera,
  Node,
  Prefab,
  instantiate,
  input,
  Input,
  KeyCode,
  director,
  PhysicsSystem2D,
  v2
} from "cc";
const { ccclass, property } = _decorator;

import MainPlayer from "./MainPlayer";
import { GameManager } from "./GameManager";

@ccclass("WorldScene")
export default class WorldScene extends Component {
  @property(Camera)
  MainCamera: Camera | null = null;

  @property(Camera)
  UICamera: Camera | null = null;

  @property(Node)
  nodeWorldRoot: Node | null = null;

  @property(Prefab)
  prefabPlayer: Prefab | null = null;

  nodeMainPlayer: Node | null = null;
  arrMoveBtnClick: number[] = [];
  nWorldGravity: number = -1;

  protected onLoad() {
    GameManager.worldScene = this;
    PhysicsSystem2D.instance.enable = true;
    PhysicsSystem2D.instance.gravity = v2(0,-520);
    
  }
  start() {
    this.nodeMainPlayer = instantiate(this.prefabPlayer);

    this.nodeWorldRoot.addChild(this.nodeMainPlayer);

    this.arrMoveBtnClick = [];

    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }
  onTouchEnd() {
    this.nodeMainPlayer.getComponent(MainPlayer).runAttack();
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case KeyCode.KEY_A:
        if (
          this.arrMoveBtnClick[this.arrMoveBtnClick.length - 1] != event.keyCode
        ) {
          this.nodeMainPlayer.getComponent(MainPlayer).setPlayerInRunning(true);
          this.nodeMainPlayer
            .getComponent(MainPlayer)
            .setPlayerFaceRight(false);
          this.arrMoveBtnClick.push(event.keyCode);
        }
        break;
      case KeyCode.KEY_D:
        if (
          this.arrMoveBtnClick[this.arrMoveBtnClick.length - 1] != event.keyCode
        ) {
          this.nodeMainPlayer.getComponent(MainPlayer).setPlayerInRunning(true);
          this.nodeMainPlayer.getComponent(MainPlayer).setPlayerFaceRight(true);
          this.arrMoveBtnClick.push(event.keyCode);
        }
        break;
      case KeyCode.KEY_J:
        this.nodeMainPlayer.getComponent(MainPlayer).runAttack();
        break;
      case KeyCode.SPACE:
        this.nodeMainPlayer.getComponent(MainPlayer).runJump();
        break;
      case KeyCode.KEY_K:
        this.nodeMainPlayer.getComponent(MainPlayer).runRolling();
        break;
    }
  }
  onKeyUp(event) {
    switch (event.keyCode) {
      case KeyCode.KEY_A:
        let aIndex = this.arrMoveBtnClick.indexOf(event.keyCode);
        this.arrMoveBtnClick.splice(aIndex, 1);
        if (this.arrMoveBtnClick.length == 0) {
          this.nodeMainPlayer
            .getComponent(MainPlayer)
            .setPlayerInRunning(false);
        }
        break;
      case KeyCode.KEY_D:
        let dIndex = this.arrMoveBtnClick.indexOf(event.keyCode);
        this.arrMoveBtnClick.splice(dIndex, 1);
        if (this.arrMoveBtnClick.length == 0) {
          this.nodeMainPlayer
            .getComponent(MainPlayer)
            .setPlayerInRunning(false);
        }
        break;
      case KeyCode.KEY_J:
        break;
    }
  }
}
