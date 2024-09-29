import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinCost')
export class CoinCost extends Component {

    @property
    coinPrize : number = 1;
    start() {

    }

    update(deltaTime: number) {
        
    }
}

