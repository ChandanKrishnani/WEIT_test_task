import { _decorator, Component, AudioClip, Vec3, Tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinScript')
export default class CoinScript extends Component {
    @property
    jumpHeight: number = 0;

    @property
    jumpDuration: number = 0;

    @property({ type: AudioClip })
    jumpAudio: AudioClip | null = null;

    onLoad() {
        this.playJumpAnimation();

        // Schedule removal of the node after 1 second
        this.scheduleOnce(() => {
            this.node.removeFromParent();
        }, 1);
    }

    playJumpAnimation() {
        // Initial opacity set to 0 (for fade in)
        this.node.opacity = 0;

        const fadeIn = new Tween(this.node).to(0, { opacity: 255 });
        const jumpUp = new Tween(this.node).to(this.jumpDuration, { position: new Vec3(0, this.jumpHeight, 0) })
            .easing('cubicOut');
        const jumpDown = new Tween(this.node).to(this.jumpDuration, { position: new Vec3(0, 0, 0) })
            .easing('cubicIn');
        const fadeOut = new Tween(this.node).to(1, { opacity: 0 });

        // Combine all tweens in sequence
        fadeIn.chain(jumpUp).chain(jumpDown).chain(fadeOut).start();
    }

    start() {
        // Any additional startup logic can go here
    }
}
