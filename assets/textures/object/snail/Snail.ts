// // Learn TypeScript:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Vec2, AudioClip, Animation, Intersection2D, Collider2D, Contact2DType, RigidBody2D, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SnailScript')
export default class Snail extends Component {
    @property
    speed: number = -1;
    
    @property
    isAlive: boolean = true;
    @property
    canMove: boolean = true;
    @property({type: AudioClip})
    dieAudio: AudioClip | null = null;
    touchingNumber: number = 0;
    anim: Animation | null = null;
//    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.touchingNumber = 0;
        this.anim = this.getComponent(Animation);
    }
    start() {
        this.touchingNumber = 0;
        this.anim = this.getComponent(Animation);
        let collider = this.getComponent(Collider2D);
        this.node.on("playDead" , this.playDieAnimation , this);
        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter,this);
    }
}
playDieAnimation (){
    tween(this.node).to(0.05,{scale : new Vec3(1,0,1)}).call(()=>{this.node.destroy()}).start();
}

    onCollisionEnter( _self ,other,_contact ) {
        if (other.tag == 2) {
        this.turn();
        this.speed = -(this.speed);
        this.node.getComponent(RigidBody2D).linearVelocity = new  Vec2(this.speed ,0);
      
        }
    }

    
    turn() {
        this.node.setScale(new Vec3(-this.node.scale.x,this.node.scale.y,1));
    }

}