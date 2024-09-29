// // Learn TypeScript:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Vec2, AudioClip, Animation, Vec3, Intersection2D, Collider2D, Contact2DType, RigidBody2D, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Beetle')
export default class Beetle extends Component {
    @property()
    speed: number = -2;
    @property
    scaleX: number = 1;
    @property
    canMove: boolean = true;
    @property({ type: AudioClip })
    dieAudio: AudioClip | null = null;
    anim: Animation | null = null;
//    // LIFE-CYCLE CALLBACKS:
    onLoad() {

    


    }
    start() {


        this.node.setScale(new Vec3(-1,this.node.scale.y, 1));
        this.anim = this.getComponent(Animation);   
        let collider = this.getComponent(Collider2D);
        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter,this);
        }
        this.node.on("playDead" , this.playDieAnimation , this);
    }
    onCollisionEnter(self : Collider2D,other : Collider2D , contact) {
        if (other.tag == 2) {
        this.turn();
        this.speed = -(this.speed);
        this.node.getComponent(RigidBody2D).linearVelocity = new  Vec2(this.speed ,0);
      
        }
    }
    playDieAnimation (){
        tween(this.node).to(0.05,{scale : new Vec3(1,0,1)}).call(()=>{this.node.destroy()}).start();
    }
    turn() {
        this.node.setScale(new Vec3(-this.node.scale.x,this.node.scale.y,1));
    }
}
