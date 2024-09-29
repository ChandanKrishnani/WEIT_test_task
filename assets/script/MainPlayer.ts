import {
  _decorator,
  Component,
  Node,
  RigidBody2D,
  math,
  Vec3,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  director,
  BoxCollider2D,
  Vec2,
} from "cc";
const { ccclass, property } = _decorator;

import { PlayerActions, PlayerStatusMachine } from "./StatusSrc/PlayerStatusMachine";
import AttackStatus from "./StatusSrc/PlayerStatus/AttackStatus";
import { CoinCost } from "./comman/CoinCost";
import { GameResultType } from "./comman/PersistNode";
import { GameManager } from "./managers/GameManager";
import { GAME_EVENT, SOUNDS_NAME } from "./constants/Constant";
import { ResourcesManager } from "./managers/ResourcesManager";

// Enum for tag values to represent different collider objects
enum ColliderTags {
  ENEMY = 9,           // Tag for enemies
  COIN = 8,            // Tag for coins
  GROUND = 2,          // Tag for ground
  PLATFORM = 3,        // Tag for platforms
  WIN_CONDITION = 11,  // Tag for reaching the win condition
}

@ccclass("MainPlayer")
export default class MainPlayer extends Component {
  @property(Node)
  spritePlayer: Node | null = null; // Player's sprite node

  // Physics and state variables
  rigidbody: RigidBody2D | null = null;
  machineOBJ: PlayerStatusMachine | null = null;

  // Player attributes
  nPlayerAttackLV = 1;        // Player attack level
  nPlayerRunSpeed = 4;        // Running speed
  nPlayerRollSpeed = 7.5;     // Rolling speed
  nPlayerHP = 100;            // Health points (HP)
  nPlayerMP = 100;            // Magic points (MP)
  nPlayerNP = 100;            // Endurance points (NP)
  nPlayerHPRecov = 0;         // HP recovery speed
  nPlayerMPRecov = 0;         // MP recovery speed
  nPlayerNPRecov = 0;         // NP recovery speed

  // Player state flags
  bPlayerInRunning = false;   // Is the player currently running?
  nCachedPlayerFace = 1;      // Cached value to store the player's facing direction

  onLoad() {
    // Initialize the rigidbody component and enable the contact listener
    this.rigidbody = this.node.getComponent(RigidBody2D);
    if (this.rigidbody) this.rigidbody.enabledContactListener = true;
  }

  start() {
    // Set up collision event listeners
    const collider = this.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      // collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    // Initialize the player status machine
    this.machineOBJ = new PlayerStatusMachine(this, this.spritePlayer);
    console.log("--rigidBody--", this.rigidbody);
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact
  ) {
    // Get contact world manifold information
    let worldManifold = contact.getWorldManifold();
    let normal = worldManifold.normal;
  
    // Get tags for colliders
    let nOtherTag = otherCollider.tag;
  
    // Switch based on the tag of the other collider
    switch (nOtherTag) {
      case ColliderTags.ENEMY:
        this.handleEnemyContact(otherCollider);
        break;
  
      case ColliderTags.COIN:
        this.handleCoinContact(otherCollider);
        break;
  
      case ColliderTags.WIN_CONDITION:
        this.handleWinCondition();
        break;
  
      case ColliderTags.GROUND:
      case ColliderTags.PLATFORM:
        if (normal.y > 0 || normal.y < 0) {
          this.handleGroundOrPlatformCollision();
        }
        break;
  
      case ColliderTags.GROUND:
        if (normal.y >= 1) {
          this.handleWallJump(contact);
        }
        break;
  
      default:
        console.log("Unhandled collider tag:", nOtherTag);
        break;
    }
  }
  
  // Handle collision with an enemy
  handleEnemyContact(otherCollider: Collider2D) {
    // If the player is falling, attacking, or jumping, disable enemy's rigidbody and play the death animation
    if (
      this.machineOBJ.getCurStatusKey() === PlayerActions.fallDown ||
      this.machineOBJ.getCurStatusKey() === PlayerActions.attack ||
      this.machineOBJ.getCurStatusKey() === PlayerActions.jump
    ) {
      this.scheduleOnce(() => {
        if (otherCollider?.node) {
          otherCollider.node.getComponent(RigidBody2D).enabled = false;
          otherCollider.node.emit("playDead");
        }
      });
    } else {
      // If not, trigger the player's death animation
      this.scheduleOnce(() => {
        this.playerDieAnimation();
      });
    }
  }
  
  // Handle collision with a coin
  handleCoinContact(otherCollider: Collider2D) {
    this.scheduleOnce(() => {
      if (otherCollider?.node) {
        // Play the coin collection sound and emit an event to trigger coin animation
        GameManager.Instance.PersistNodeRef.playEffect(
          ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.COIN)
        );
        director.emit(
          "PlayCoinAnimation",
          this.node.getPosition(),
          otherCollider.node.getPosition(),
          otherCollider.node.getComponent(CoinCost).coinPrize
        );
        // Destroy the coin node after collection
        otherCollider.node.destroy();
      }
    });
    // console.log("Coin collected", selfCollider, otherCollider);
  }
  
  // Handle win condition (e.g., when the player reaches the goal)
  handleWinCondition() {
    this.playerWinAnimation();
  }
  
  // Handle ground or platform collision
  handleGroundOrPlatformCollision() {
    // If the player is falling or jumping, switch to move or stand state based on running status
    if (
      this.machineOBJ.getCurStatusKey() === PlayerActions.fallDown ||
      this.machineOBJ.getCurStatusKey() === PlayerActions.jump
    ) {
      if (this.bPlayerInRunning) {
        this.machineOBJ.changeStatus(PlayerActions.move);
      } else {
        this.machineOBJ.changeStatus(PlayerActions.stand1);
      }
    }
  }
  
  // Handle wall jump (disabling collision when jumping through from below)
  handleWallJump(contact: IPhysics2DContact) {
    if (this.machineOBJ.getCurStatusKey() === PlayerActions.jump) {
      contact.disabled = true;
    }
  }
  

  // Handle player attack action
  runAttack() {
    const curStatus = this.machineOBJ.curStatus as AttackStatus;

    // Change status to attack if player isn't already attacking
    if (this.machineOBJ.getCurStatusKey() !== PlayerActions.attack || !curStatus.bInAttackAnimation) {
      this.machineOBJ.changeStatus(PlayerActions.attack);
    }
  }
// Play player death win animation and trigger game over event
playerWinAnimation(){
    director.emit(GAME_EVENT.SHOW_GAME_END_POPUP,GameResultType.PLAYER_WON);
 }


  // Play player death animation and trigger game over event
  playerDieAnimation() {
    this.bPlayerInRunning = false;
     this.node.getComponent(BoxCollider2D).group = 3;
    this.machineOBJ.changeStatus(PlayerActions.died); // Change status to 'died'
    director.emit(GAME_EVENT.SHOW_GAME_END_POPUP, GameResultType.PLAYER_LOSE); // Emit game over event
  }

  // Handle player rolling action
  runRolling() {
    // Change status to rolling if not jumping or falling
    if (![PlayerActions.jump, PlayerActions.fallDown, PlayerActions.rolling].includes(this.machineOBJ.getCurStatusKey())) {
      this.machineOBJ.changeStatus(PlayerActions.rolling);
      this.nPlayerRunSpeed = this.nPlayerRollSpeed;
    }
  }

  // Handle player jumping action
  runJump() {
    // Prevent jumping if the player is attacking
    if (this.machineOBJ.getCurStatusKey() === PlayerActions.attack) return;

    // If not already jumping or falling, change status to jump and apply upward force
    if (![PlayerActions.jump, PlayerActions.fallDown].includes(this.machineOBJ.getCurStatusKey())) {
      this.machineOBJ.changeStatus(PlayerActions.jump);
      this.rigidbody?.applyLinearImpulse(new math.Vec2(0, 150), new math.Vec2(0, 0), true);
    }
  }

  // Set player running state and change status accordingly
  setPlayerInRunning(bRunning: boolean) {
    this.bPlayerInRunning = bRunning;

    if (
      bRunning &&
      ![PlayerActions.attack, PlayerActions.fallDown, PlayerActions.jump].includes(this.machineOBJ.getCurStatusKey())
    ) {
      this.machineOBJ.changeStatus(PlayerActions.move);
    } else if (
      !bRunning &&
      ![PlayerActions.attack, PlayerActions.fallDown, PlayerActions.jump].includes(this.machineOBJ.getCurStatusKey())
    ) {
      this.machineOBJ.changeStatus(PlayerActions.stand1);
    }
  }

  // Set player's facing direction
  setPlayerFaceRight(bRight: boolean) {
    this.nCachedPlayerFace = bRight ? 1 : -1; // Cache the facing direction
  }

  // Ensure player is facing the correct direction
  setPlayerFace() {
    if (this.machineOBJ.getCurStatusKey() === PlayerActions.attack) return;

    if (this.node.scale.x !== this.nCachedPlayerFace) {
      this.node.setScale(new Vec3(this.nCachedPlayerFace, this.node.scale.y, 1)); // Flip player horizontally
    }
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
