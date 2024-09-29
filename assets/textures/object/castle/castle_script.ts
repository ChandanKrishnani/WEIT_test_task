// // Learn TypeScript:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CastleScript')
export default class NewClass extends Component {
    @property({type: AudioClip})
    high_score_Audio: AudioClip | null = null;
//    // LIFE-CYCLE CALLBACKS:
//    // use this for initialization
    onLoad() {

    }
    onCollisionEnter(other, self) {
        this.scheduleOnce(function () {
        
        }, 2);

        this.scheduleOnce(function () {
           
        }, 2);
    }
    start() {

    }

}
