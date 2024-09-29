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
  v2,
  PHYSICS_2D_PTM_RATIO,
  EPhysics2DDrawFlags,
  System,
  sys
} from "cc";
const { ccclass, property } = _decorator;

import MainPlayer from "./MainPlayer";
import { GameManager } from "./managers/GameManager";
// import { GameManager } from "./GameManager";

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
    GameManager.Instance.WorldScene = this;
    PhysicsSystem2D.instance.gravity = v2(0, -25 * PHYSICS_2D_PTM_RATIO);
    const system = PhysicsSystem2D.instance;

    // Physics timestep, default fixedTimeStep is 1/60
    sys.isMobile &&  sys.OS.IOS == sys.os && (system.fixedTimeStep = 1/30);
    
    // The number of iterations per update of the Physics System processing speed is 10 by default
    system.velocityIterations = 8;

    // The number of iterations per update of the Physics processing location is 10 by default
    system.positionIterations = 8;

    // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
    // EPhysics2DDrawFlags.Pair |
    // EPhysics2DDrawFlags.CenterOfMass |
    // EPhysics2DDrawFlags.Joint |
    // EPhysics2DDrawFlags.Shape;
    
  }
  start() {
    this.nodeMainPlayer = instantiate(this.prefabPlayer);

    this.nodeWorldRoot.addChild(this.nodeMainPlayer);

    this.arrMoveBtnClick = [];

    // this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this); 
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }
  onTouchEnd() {
    this.nodeMainPlayer.getComponent(MainPlayer).runAttack();
  }

  onKeyDown(event) {
    console.log("Getting keydow",event);
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
