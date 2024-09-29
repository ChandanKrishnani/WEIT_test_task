import {
  _decorator,
  Button,
  Component,
  KeyCode,
  Node,
  NodeEventType,
} from "cc";
import { DataManager } from "../managers/DataManager";
import { GameManager } from "../managers/GameManager";
const { ccclass, property } = _decorator;

@ccclass("MobileAdapter")
export class MobileAdapter extends Component {
  @property(Node)
  rightArrow: Node = null;

  @property(Node)
  leftArrow: Node = null;

  @property(Node)
  jump: Node = null;

  @property(Node)
  roll: Node = null;

  @property(Node)
  attack: Node = null;

  start() {
    //Right arrow key events
    this.rightArrow.on(NodeEventType.TOUCH_START, this.movePlayerRight, this);
    this.rightArrow.on(NodeEventType.TOUCH_END, this.stopMovePlayerRight, this);

    //Left arrow key event
    this.leftArrow.on(NodeEventType.TOUCH_START, this.movePlayerLeft, this);
    this.leftArrow.on(NodeEventType.TOUCH_END, this.stopMovePlayerLeft, this);


    //Powers
    this.jump.on(NodeEventType.TOUCH_START, this.playerJump, this);
    this.roll.on(NodeEventType.TOUCH_START, this.playerRoll, this);
    this.attack.on(NodeEventType.TOUCH_START, this.playerAttack, this);
  }

  playerAttack() {
    const event: { keyCode: number } = { keyCode: KeyCode.KEY_J };
    GameManager.Instance.WorldScene.onKeyDown(event);
  }
  playerRoll() {
    const event: { keyCode: number } = { keyCode: KeyCode.KEY_K };
    GameManager.Instance.WorldScene.onKeyDown(event);
  }
  playerJump() {
    const event: { keyCode: number } = { keyCode: KeyCode.SPACE };
    GameManager.Instance.WorldScene.onKeyDown(event);
  }

  movePlayerRight() {
    const event: { keyCode: number } = { keyCode: KeyCode.KEY_D };
    GameManager.Instance.WorldScene.onKeyDown(event);
  }

  movePlayerLeft() {
    const event: { keyCode: number } = { keyCode: KeyCode.KEY_A };
    GameManager.Instance.WorldScene.onKeyDown(event);
  }

  stopMovePlayerLeft() {
    const event: { keyCode: number } = { keyCode: KeyCode.KEY_A };
    GameManager.Instance.WorldScene.onKeyUp(event);
  }

  stopMovePlayerRight() {
    const event: { keyCode: number } = { keyCode: KeyCode.KEY_D };
    GameManager.Instance.WorldScene.onKeyUp(event);
  }

}
