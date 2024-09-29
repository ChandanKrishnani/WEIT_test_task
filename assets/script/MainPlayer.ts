import {
  _decorator,
  Component,
  Node,
  RigidBody2D,
  math,
  Vec3,
  Animation,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  PhysicsSystem2D,
  CircleCollider2D,
  director,
  tween,
  BoxCollider2D,
} from "cc";
const { ccclass, property } = _decorator;

// import { GameManager } from "./GameManager";
import {
  PlayerActions,
  PlayerStatusMachine,
} from "./StatusSrc/PlayerStatusMachine";
import AttackStatus from "./StatusSrc/PlayerStatus/AttackStatus";
import { CoinCost } from "./comman/CoinCost";
import Beetle from "../textures/object/beetle/Beetle";
import Snail from "../textures/object/snail/Snail";
import { GameResultType } from "./comman/PersistNode";
import CoinScript from "../textures/object/coin/coin_script";
import { GameManager } from "./managers/GameManager";
import { SOUNDS_NAME } from "./constants/Constant";
import { ResourcesManager } from "./managers/ResourcesManager";

@ccclass("MainPlayer")
export default class MainPlayer extends Component {
  @property(Node)
  spritePlayer: Node | null = null;

  rigidbody: RigidBody2D | null = null;
  nPlayerAttackLV: number = 1;
  bPlayerInRunning: boolean = false;
  nCachedPlayerFace: number = 1;
  machineOBJ: PlayerStatusMachine = null;

  nPlayerRunSpeed: number = 4;
  //Speed ​​when rolling
  nPlayerRollSpeed: number = 7.5;
  //hp
  nPlayerHP: number = 100;
  //mp
  nPlayerMP: number = 100;
  //endurance
  nPlayerNP: number = 100;
  //HP recovery speed (per second)
  nPlayerHPRecov: number = 0;
  //mp reply speed (per second)
  nPlayerMPRecov: number = 0;
  //    //np reply speed (per second)
  nPlayerNPRecov: number = 0;

  onLoad() {
    this.rigidbody = this.node.getComponent(RigidBody2D);
    this.rigidbody.enabledContactListener = true;
  }
  start() {
    let collider = this.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    this.bPlayerInRunning = false;
    this.nPlayerAttackLV = 1;
    console.log("--rigidBody--", this.rigidbody);
    this.machineOBJ = new PlayerStatusMachine(this, this.spritePlayer);

    //        /*
    // play: When starting to play
    // stop: when stopping playback
    // pause: when pausing playback
    // resume: when resuming playback
    // lastframe: If the number of animation loops is greater than 1, when the animation plays to the last frame
    // finished: when animation playback is completed
    //        */
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact
  ) {

    let worldManifold = contact.getWorldManifold();
    let points = worldManifold.points;
    let normal = worldManifold.normal;
    let nOtherTag = otherCollider.tag;
    let nSelfTag = selfCollider.tag;

    if (nOtherTag == 9) {
      if (
        this.machineOBJ.getCurStatusKey() == PlayerActions.fallDown ||
        this.machineOBJ.getCurStatusKey() == PlayerActions.attack ||
        this.machineOBJ.getCurStatusKey() == PlayerActions.jump
      ) {
        this.scheduleOnce(() => {
          if (otherCollider?.node) {
            otherCollider.node.getComponent(RigidBody2D).enabled = false;
            otherCollider.node.emit("playDead");
          }
        });
      } else {
        this.scheduleOnce(() => {
            this.playerDieAnimation();
        //   selfCollider.node.destroy();

        });
      }
    }

    if (nOtherTag == 8) {
      this.scheduleOnce(() => {
        if (otherCollider?.node) {
          GameManager.Instance.PersistNodeRef.playEffect(
            ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.COIN)
          );
          director.emit(
            "PlayCoinAnimation",
            this.node.getPosition(),
            otherCollider.node.getPosition(),
            otherCollider.node.getComponent(CoinCost).coinPrize
          );
          otherCollider.node.destroy();
        }
      });
      // otherCollider.node.active && (otherCollider.node.active = false);
      console.log("coins colided", selfCollider, otherCollider);
    }

    if(nOtherTag == 11){
      this.PlayerwonAnimation();
      
    }

    if ((nOtherTag == 3 || nOtherTag == 2) && (normal.y > 0 || normal.y < 0)) {
      if (
        this.machineOBJ.getCurStatusKey() == PlayerActions.fallDown ||
        this.machineOBJ.getCurStatusKey() == PlayerActions.jump
      ) {
        if (this.bPlayerInRunning) {
          this.machineOBJ.changeStatus(PlayerActions.move);
        } else {
          // this.rigidbody.linearVelocity = new math.Vec2(0, 0);
          this.machineOBJ.changeStatus(PlayerActions.stand1);
        }

        // console.log("--",this.rigidbody.linearVelocity);
      }
    }

    // You can go up through the wall from underneath
    if (nOtherTag == 2 && normal.y >= 1) {
      if (this.machineOBJ.getCurStatusKey() == PlayerActions.jump) {
        contact.disabled = true;
      }
    }
  }
  //    //Only called once when the two colliders end contact
  onEndContact(contact, selfCollider, otherCollider) {}
  //    //Called every time the collision logic is about to be processed
  onPreSolve(contact, selfCollider, otherCollider) {}
  //    //Called every time the collision body contact logic is processed
  onPostSolve(contact, selfCollider, otherCollider) {}
  runAttack() {
    // @ts-ignore
    let curStatus: AttackStatus = this.machineOBJ.curStatus;
    if (
      this.machineOBJ.getCurStatusKey() != PlayerActions.attack ||
      !curStatus.bInAttackAnimation
    ) {
      this.machineOBJ.changeStatus(PlayerActions.attack);
    }
  }

  playerDieAnimation(){
    
    this.bPlayerInRunning = false;
    // this.node.getComponent(BoxCollider2D).group = 3;
    this.machineOBJ.changeStatus(PlayerActions.died); 
    
    // console.log("game end called" , director.getScene());
    director.emit("ShowGameEndPopup",GameResultType.PLAYER_LOSE);
  

    
  }

  PlayerwonAnimation(){
     director.emit("ShowGameEndPopup",GameResultType.PLAYER_WON);
  }
  runRolling() {
  
    if (
      this.machineOBJ.getCurStatusKey() != PlayerActions.jump &&
      this.machineOBJ.getCurStatusKey() != PlayerActions.fallDown &&
      this.machineOBJ.getCurStatusKey() != PlayerActions.rolling
    ) {
      this.machineOBJ.changeStatus(PlayerActions.rolling);
      this.nPlayerRunSpeed = this.nPlayerRollSpeed;
    }
  }
  runJump() {
    if (this.machineOBJ.getCurStatusKey() == PlayerActions.attack) {
      return;
    }
    if (
      this.machineOBJ.getCurStatusKey() != PlayerActions.jump &&
      this.machineOBJ.getCurStatusKey() != PlayerActions.fallDown
    ) {
      this.machineOBJ.changeStatus(PlayerActions.jump);

      this.rigidbody.applyLinearImpulse(
        new math.Vec2(0, 150),
        new math.Vec2(0, 0),
        true
      );
    }
  }
  runFallDown() {
    if (this.machineOBJ.getCurStatusKey() != PlayerActions.fallDown) {
      this.machineOBJ.changeStatus(PlayerActions.fallDown);
    }
  }
  setPlayerInRunning(bRunning: boolean) {
    this.bPlayerInRunning = bRunning;
    if (
      bRunning &&
      this.machineOBJ.getCurStatusKey() != PlayerActions.attack &&
      this.machineOBJ.getCurStatusKey() != PlayerActions.fallDown &&
      this.machineOBJ.getCurStatusKey() != PlayerActions.jump
    ) {
      console.log("set player run", this.nPlayerRunSpeed);
      this.machineOBJ.changeStatus(PlayerActions.move);
    } else if (
      !bRunning &&
      this.machineOBJ.getCurStatusKey() != PlayerActions.attack &&
      this.machineOBJ.getCurStatusKey() != PlayerActions.fallDown &&
      this.machineOBJ.getCurStatusKey() != PlayerActions.jump
    ) {
      this.machineOBJ.changeStatus(PlayerActions.stand1);
    }
  }

  setPlayerFaceRight(bRight: boolean) {
    let nScaleX = bRight ? 1 : -1;
    this.nCachedPlayerFace = nScaleX;
  }
  setPlayerFace() {

    //If in attack action
    if (this.machineOBJ.getCurStatusKey() == PlayerActions.attack) {
      return;
    }
    if (this.node.scale.x == this.nCachedPlayerFace) {
      return;
    }
    this.node.setScale(new Vec3(this.nCachedPlayerFace, this.node.scale.y, 1));
  }

  update(dt: number) {
    if (this.machineOBJ) this.machineOBJ.mUpdate(dt);

    this.setPlayerFace();

    if (
      (this.machineOBJ.getCurStatusKey() != PlayerActions.attack &&
        this.bPlayerInRunning) ||
      this.machineOBJ.getCurStatusKey() == PlayerActions.rolling
    ) {
      let scaleX = this.node.scale.x;
      let posX = this.node.position.x;
      posX += scaleX == 1 ? this.nPlayerRunSpeed : -this.nPlayerRunSpeed;
      this.node.setPosition(new Vec3(posX, this.node.position.y, 1));
    }

    //Players are falling
    let velocity = this.rigidbody.linearVelocity;
    // console.log(velocity);

    if (velocity.y < 0) {
      // this.runFallDown();
    }
    const cameraNode = GameManager.Instance.WorldScene.MainCamera.node;
    cameraNode.setPosition(
      new Vec3(
        this.node.position.x < 0 ? 0 : this.node.position.x,
        cameraNode.position.y,
        cameraNode.position.z
      )
    );
  }
}
