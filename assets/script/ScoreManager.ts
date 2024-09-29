import { _decorator, Component, director, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {

    @property({type : Label})
    scoreLable : Label = null;

    currentScoreCount: number = 0;
    

    start() {
        director.on("UpdateScore" , this.udpateScore , this);
    }
    
    udpateScore(incBy : number){
        this.currentScoreCount += incBy;
        this.scoreLable.string = this.currentScoreCount.toString();
    }

    update(deltaTime: number) {
        
    }
}

