import { PersistNode } from "../comman/PersistNode";
import WorldScene from "../WorldScene";

export class GameManager {
    private static _instance: GameManager | null = null;

    private persistNodeRef: PersistNode = null!;
    private worldScene: WorldScene = null;
    public static get Instance() {
        if (!GameManager._instance) {
            GameManager._instance = new GameManager();
        }
        return GameManager._instance;
    }

    set WorldScene(ref: WorldScene) {
        this.worldScene = ref;
    }

    get WorldScene(): WorldScene {
        return this.worldScene;
    }

    set PersistNodeRef(ref: PersistNode) {
        this.persistNodeRef = ref;
    }

    get PersistNodeRef(): PersistNode {
        return this.persistNodeRef;
    }
}
