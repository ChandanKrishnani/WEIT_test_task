import {
  _decorator,
  Component,
  director,
  Enum,
  instantiate,
  Node,
  Prefab,
  tween,
  UITransform,
  v2,
  v3,
  Vec2,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

enum animationType {
  ONCE,
  INFINITE,
}

@ccclass("CoinAnimation")
export class CoinAnimation extends Component {
  @property({ type: Prefab, visible: true })
  private coinPrefab: Prefab = null!;

  @property({ type: Node, visible: true })
  private startPos: Node = null!;

  @property({ type: Node, visible: true })
  private endPos: Node = null!;

  @property({ type: Enum(animationType), visible: true })
  private animationType: animationType = animationType.ONCE;

  @property({ type: Node })
  coinsContainer: Node = null!;

  private coins_anim: Node[] = [];

  private animationTimes = -5;
  private _coinAnimationStartPos: Vec3 = null;
  private _coinAnimationEndPos: Vec3 = null;
  private coinPointer = 0;
  private maxPoolSize = 15;

  onEnable() {
    if (this.animationType == animationType.ONCE) this.animationTimes = 1;
    else if (this.animationType == animationType.INFINITE)
      this.animationTimes = -1;
  }

  onLoad() {
    this.initCoinPool();
  }

  protected start(): void {
    director.on("PlayCoinAnimation", this.setStartEndpoistion, this);
  }

  setStartEndpoistion(start: Vec3, end: Vec3, prizeMoney: number) {
    const padding = this.node.getComponent(UITransform).width * 0.35; // 0.5 for half of screen size and 0.1 is padding
    this._coinAnimationStartPos = start;
    this._coinAnimationEndPos = new Vec3(
      start.x - padding,
      start.y + padding,
      1
    );
    this.startPos.setPosition(start);
    this.endPos.setPosition(this._coinAnimationEndPos);
    this.showCoinAnimation(prizeMoney);
  }

  // public set CoinAnimationStartPos(value: Node) {
  //     this.startPos.setWorldPosition(value.getWorldPosition())
  // }

  // public set CoinAnimationEndPos(value: Node) {
  //     this.endPos.setWorldPosition(value.getWorldPosition())
  // }

  initCoinPool() {
    // Instantiate Coins.
    this.coins_anim = [];
    for (let i = 0; i < this.maxPoolSize; i++) {
      const coin = instantiate(this.coinPrefab);
      coin.active = false;
      // coin.children[0].active = true;
      this.node.parent!.addChild(coin);
      this.coins_anim.push(coin);
    }
  }

  showCoinAnimation(prizeMoney: number) {
    // if (!this.animationTimes) return;
    // if (this.animationTimes > 0) this.animationTimes--;
    // / Coin Animation from here.
    const rand = Math.random() > 0.5 ? -200 : 200;
    this.coinPointer == this.maxPoolSize && (this.coinPointer = 0);
    const coin = this.coins_anim[this.coinPointer];
    // for (const coin of this.coins_anim) {

    // coin.stopAllActions();
    coin.active = true;
    const start = this.startPos.getWorldPosition();
    const end = this.endPos.getWorldPosition();
    const mid = v2(start.x + rand, start.y);
    const bezier = [start, mid, end];
    coin.setWorldPosition(start);
    this.bezierTo(
      coin,
      Math.random() + 0.5,
      v2(start.x, start.y),
      v2(mid.x, mid.y),
      v3(end.x, end.y, 0),
      null,
      () => {
        director.emit("UpdateScore", prizeMoney);

        coin.active = false;
      }
    ).start();
    ++this.coinPointer;

    // }
  }

  /**
   *  Second-order Bezier curve motion
   * @param target
   * @param {number} duration
   * @param {} c1 Starting point coordinates
   * @param {} c2 control point
   * @param {Vec3} to End point coordinates
   * @param opts
   * @returns {any}
   */
  bezierTo(
    target: any,
    duration: number,
    c1: Vec2,
    c2: Vec2,
    to: Vec3,
    opts: any,
    callback: Function
  ) {
    opts = opts || Object.create(null);
    /**
     * @desc Second-order Bezier
     * @param {number} t Current percentage
     * @param {} p1 Starting point coordinates
     * @param {} cp control point
     * @param {} p2 End point coordinates
     * @returns {any}
     */
    let twoBezier = (t: number, p1: Vec2, cp: Vec2, p2: Vec3) => {
      let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
      let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
      return v3(x, y, 0);
    };
    opts.onUpdate = (arg: Vec3, ratio: number) => {
      target.worldPosition = twoBezier(ratio, c1, c2, to);
    };
    return tween(target).to(duration, {}, opts).call(callback);
  }
}
