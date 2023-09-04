
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Menu
 * DateTime = Tue Aug 08 2023 13:08:00 GMT+0200 (South Africa Standard Time)
 * Author = Puru
 * FileBasename = Menu.ts
 * FileBasenameNoExtension = Menu
 * URL = db://assets/scripts/Menu.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('Menu')
export class Menu extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({ type: Node })
    menu: Node = null;
    @property({ type: Node })
    leveleditor: Node = null;
    @property({ type: Node })
    leveltester: Node = null;

    start () {
        // [3]
    }
    public GoToMenu() {
        this.menu.active=true;
        this.leveleditor.active=false;
        this.leveltester.active=false;
    }
    public  GoToEditor(){
        this.menu.active=false;
        this.leveleditor.active=true;
        this.leveltester.active=false;
    }
    public  GoToTester(){
        this.menu.active=false;
        this.leveleditor.active=false;
        this.leveltester.active=true;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
