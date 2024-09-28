// // Learn TypeScript:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Vec2, AudioClip, Animation, Vec3, Intersection2D, Collider2D, Contact2DType, RigidBody2D } from 'cc';
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
            console.log("has colider compoennt");
            collider.on(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter,this);
        }
    }
    onCollisionEnter(self : Collider2D,other : Collider2D , contact) {

        // console.log("BEETLE COLIDING");
        if (other.tag == 2) {
        this.turn();
        this.speed = -(this.speed);
        // console.log("Nes speed", this.speed);
        this.node.getComponent(RigidBody2D).linearVelocity = new  Vec2(this.speed ,0);
      
        }

        // var otherAabb = other.world.aabb;
        // var otherPreAabb = other.world.preAabb.clone();

        // var selfAabb = self.world.aabb;
        // var selfPreAabb = self.world.preAabb.clone();
        // selfPreAabb.y = selfAabb.y;
        // otherPreAabb.y = otherAabb.y;

        // if (Intersection2D.rectRect(selfPreAabb, otherPreAabb)) {

        //     console.log("other node group", other.node.group);
        // if (selfPreAabb.yMax < otherPreAabb.yMax && other.node.group == 'player') {
        // this.todie();
        // }
        // }
    }
    todie() {
       //cc.audioEngine.play(this.dieAudio, false, Global.volume);
        this.anim.play('beetled');
        this.canMove = false;
        this.node.height = this.node.height * 0.3;
       // this.node.y = 0.5*this.node.y;
       // var action = cc.fadeOut(1.0);
        // this.node.runAction(cc.fadeOut(.5));

        this.scheduleOnce(function () {
        this.node.removeFromParent();
        }, 0.5);
    }
    update(dt) {
        if (this.canMove) {
        // this.node.position.x -= this.speed.x * dt;
        

        }
    }
    turn() {
       // this.speedX = -100;
        this.node.setScale(new Vec3(-this.node.scale.x,this.node.scale.y,1));
    }
//    // update (dt) {}
}
