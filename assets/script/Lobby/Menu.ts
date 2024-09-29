import { _decorator, Button, Component, director, game, Node, Scene, Sprite, tween, Vec3 } from 'cc';
import FallStatus from '../StatusSrc/PlayerStatus/FallStatus';
import { GAME_EVENT, SCENE, SOUNDS_NAME } from '../constants/Constant';
import { ResourcesManager } from '../managers/ResourcesManager';
import { GameManager } from '../managers/GameManager';
import { SoundManager } from '../managers/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {



    @property(Node)
    backButton : Node = null;

    @property(Node)
    helpButton : Node = null;
    
    @property(Node)
    soundButton : Node = null;

    @property(Node)
    reloadButton : Node = null;
    

    @property(Node)
    dropdownContainer : Node = null;


    protected start(): void {
        this.setupButton(this.helpButton,false); //disabling help button we do not have redirect url for now
    }



    musicButtonClick(){
        const status = this.soundButton.getComponent(Sprite).grayscale;
        if(!status){
            this.soundButton.getComponent(Sprite).grayscale = !status;
            GameManager.Instance.PersistNodeRef.stopAudio();
            SoundManager.getInstance().CanPlayMusic = false;
        }else{

            this.soundButton.getComponent(Sprite).grayscale = !status;
            SoundManager.getInstance().CanPlayMusic = true;
            GameManager.Instance.PersistNodeRef.resumeAudio();
        }

    }
    backButtonClick(){
        GameManager.Instance.PersistNodeRef.playEffect(
            ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.DEFAULT_CLICK)
          );
        director.emit(GAME_EVENT.SWITCH_SCENE, SCENE.LOBBY);
    }
    restartButtonClick(){
        GameManager.Instance.PersistNodeRef.playEffect(
            ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.DEFAULT_CLICK)
          );
        director.emit(GAME_EVENT.SWITCH_SCENE, SCENE.GAMEPLAY);
    }
    

    setupButton(button:Node , active : boolean){
        button.getComponent(Button).interactable = active;
        button.getComponent(Sprite).grayscale =!active;
    }

    protected onEnable(): void {
        const currentScene = director.getScene().name;
        switch(currentScene)
        {
            case SCENE.LOBBY:
                this.setupButton(this.reloadButton,false);
                this.setupButton(this.backButton,false);
                break;
            case SCENE.GAMEPLAY:
                this.setupButton(this.reloadButton,true);
                this.setupButton(this.backButton,true);
                break;
        }

    }



    playPopUpOpenAnimation() {
        GameManager.Instance.PersistNodeRef.playEffect(
            ResourcesManager.Instance.getResourceFromCache(SOUNDS_NAME.DEFAULT_CLICK)
          );
            if (this.dropdownContainer?.scale.y == 0) {
                this.node.active = true;
            
                tween(this.dropdownContainer)
                    .to(0, { scale: new Vec3(1, 0.6, 0) })
                    .to(0.099, { scale: new Vec3(1, 1.15, 1) })
                    .to(0.0462, { scale: new Vec3(1, 1, 1) })
                    .to(0.0462, { scale: new Vec3(1, 1.06, 1) })
                    .to(0.066, { scale: new Vec3(1, 1, 1) })
                    // .call(() => { this.clickedOnOverlay = false })
                    .start();
            } else {
                this.node.active = false;
        
                tween(this.dropdownContainer)
                    .to(0, { scale: new Vec3(1, 1, 1) })
                    .to(0.099, { scale: new Vec3(1, 1.06, 1) })
                    .to(0.0462, { scale: new Vec3(1, 1, 1) })
                    .to(0.0462, { scale: new Vec3(1, 1.15, 1) })
                    .to(0.066, { scale: new Vec3(1, 0, 0) })
                    // .call(() => { this.clickedOnOverlay = false })
                    .start();
            }
        }
    }


