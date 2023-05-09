
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Element
 * DateTime = Sun May 07 2023 01:14:22 GMT+0530 (India Standard Time)
 * Author = Puru
 * FileBasename = Element.ts
 * FileBasenameNoExtension = Element
 * URL = db://assets/scripts/Element.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('Element')
export class Element extends Component {
    // [1]
    // dummy = '';
    _type = "";
    _creator = null;
    connectors = [];
    _placedItem = null;
    _connectedConnector = null;
    index=-1;
    // [2]
    // @property
    // serializableDummy = 0;
    init(type,creator,id) {
        this._type = type;
        this._creator = creator;
        this.index = id;
    }
 
    getData() {
        let data = {};
        data["id"] = this.index;
        if (this._placedItem) {
            data["placedItem"] = { "type": this._placedItem.type, "id": this._placedItem.index };
        }
        if (this.connectors.length > 0) {
            let connectors = [];
            this.connectors.forEach(element => {
                connectors.push(element.index);
            });
            data["connectors"] = connectors;
        }
        if (this._connectedConnector) {
            data["connectedConnector"] = this._connectedConnector.index;
        }
        data["type"] = this._type;
        data["position"] = this.node.position;
        return data;
    }
    start () {
        // [3]
    }
    select(value: boolean) {
        this._creator.selectConnector(this);
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
