// // Learn TypeScript:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Vec2, AudioClip, Animation, Intersection2D, Collider2D, Contact2DType, RigidBody2D, Vec3 } from 'cc';
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
        // this.node.scaleX = 1;
        this.anim = this.getComponent(Animation);
    }
    start() {
        this.touchingNumber = 0;
        // this.node.scaleX = 1;
        this.anim = this.getComponent(Animation);
        let collider = this.getComponent(Collider2D);
        if(collider){
            console.log("has colider compoennt");
            collider.on(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter,this);
    }
}

    onCollisionEnter( self ,other,contact ) {
        console.log("BEETLE COLIDING");
        if (other.tag == 2) {
        this.turn();
        this.speed = -(this.speed);
        console.log("Nes speed", this.speed);
        this.node.getComponent(RigidBody2D).linearVelocity = new  Vec2(this.speed ,0);
      
        }
    }
    
    update(dt) {
    //    // console.log('this.touchingNumber-----' + this.touchingNumber);
    //     if (this.canMove) {
    //     this.node.position.x -= this.speed.x * dt;
    //     }
    //     if (this.touchingNumber === 0) {
    //     this.speed.y += this.gravity * dt;
    //     if (Math.abs(this.speed.y) > this.maxSpeed.y) {
    //     this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
    //     }
    //     }
    //     this.node.position.y += this.speed.y * dt;
    }
    turn() {
        this.node.setScale(new Vec3(-this.node.scale.x,this.node.scale.y,1));
    }

}