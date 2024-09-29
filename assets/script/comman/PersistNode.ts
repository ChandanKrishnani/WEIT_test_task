import {
  _decorator,
  AudioSource,
  Component,
  director,
  Animation,
  Node,
  ProgressBar,
} from "cc";

import { GameManager } from "../managers/GameManager";
import {
  CircularLoader,
  LoaderType,
} from "../../components/loader/CircularLoader";
import { SoundManager } from "../managers/SoundManager";
import { ResourcesManager } from "../managers/ResourcesManager";
import {
  ASSET_CACHE_MODE,
  CUSTON_EVENT,
  GAME_EVENT,
  SOUNDS_NAME,
} from "../constants/Constant";
import { GameEndPopup } from "../Lobby/GameEndPopup";
const { ccclass, property } = _decorator;

export enum GameResultType  {
  PLAYER_WON,
  PLAYER_LOSE,
}

@ccclass("PersistNode")
export class PersistNode extends Component {
  @property({ type: Node })
  snakBar: Node = null!;
  @property({ type: Node }) loader: Node = null!;

  @property({ type: Node })
  musicAudioSource: Node = null;
  @property({ type: Node })
  soundAudioSource: Node = null;

  @property({ type: ProgressBar })
  loadingProgress: ProgressBar = null!;

  @property({type : Node})
  gameEndPopup : Node  = null;

  @property({type : Node})
  sceneTarnsition : Node;

  start() {
    this.registerEvents(); // rehistering global events
    director.addPersistRootNode(this.node);
    GameManager.Instance.PersistNodeRef = this;
    this.initAudioSource();
    this.loadAudios();
    this.gameEndPopup.active = false;

  }


  private registerEvents() {
    director.on(GAME_EVENT.SHOW_GAME_END_POPUP,this.showGameEndPopup , this);
    director.on(GAME_EVENT.SWITCH_SCENE, this.switchScene ,this);
  }

  switchScene(sceneName : string){
    this.sceneTarnsition.active = true;
    this.sceneTarnsition.getComponent(Animation).play('transitionIn');
    director.loadScene(sceneName,()=>{
      this.sceneTarnsition.getComponent(Animation).crossFade('transitionOut');
    });
  }



  showGameEndPopup(gameResult: GameResultType){
    this.gameEndPopup.getComponent(GameEndPopup).updatePopupStatus(gameResult);
    this.gameEndPopup.active = true;
  } 




  showLoader() {
    this.loader!.getComponent(CircularLoader)!.showLoader(
      LoaderType.FULL_SCREEN
    );
  }

  initAudioSource() {
    SoundManager.getInstance().init(
      this.musicAudioSource.getComponent(AudioSource)!
    );
    SoundManager.getInstance().initSoundEffectAS(
      this.soundAudioSource.getComponent(AudioSource)!
    );
  }

  playAudio(clip, isloopOn: boolean) {
    SoundManager.getInstance().playMusicClip(clip, isloopOn);
  }
  playEffect(clip) {
    console.log("Player sound effect of coin" , clip);
    SoundManager.getInstance().playSoundEffect(clip, false);
  }
  stopAudio() {
    SoundManager.getInstance().stopMusic();
  }
  resumeAudio() {
    SoundManager.getInstance().playMusic(true);
  }

  hideLoader() {
    this.loader!.getComponent(CircularLoader)!.stopLoader();
  }

  async loadAudios() {
    let audioResources = [
      { FunkyChill2loop: "SoundMusic/FunkyChill2loop" },
      { DefaultClick: "SoundMusic/DefaultClick" },
      { LevelComplete: "SoundMusic/LevelComplete"},
      { Coin: "SoundMusic/coin"},
    ];
    
    await ResourcesManager.loadArrayOfResource(
      audioResources,
      ASSET_CACHE_MODE.Normal,
      this.loading
    );

    SoundManager.getInstance().setMusicVolume(0.5);
    SoundManager.getInstance().setEffectsVolume(1);

    this.playAudio(
      ResourcesManager.Instance.getResourceFromCache(
        SOUNDS_NAME.FUNKY_CHILL_2_LOOP
      ),
      true
    );
  }

  loading = (progress: number) => {
    // this.loadingProgress.progress = progress;
    // if (progress >= 1) {
    //   this.loadingProgress.node.active = false;
    //   director.emit(CUSTON_EVENT.LOADING_DONE);
    // }
  };
}
