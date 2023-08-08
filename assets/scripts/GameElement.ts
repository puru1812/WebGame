
import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
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
 
@ccclass('GameElement')
export class GameElement extends Component {
    // [1]
    // dummy = '';
    _type = "";
    _game = null;
    connectors = [];
    _placedItem = null;
    _connectedConnector = null;
    index = -1;
    _data = null;
    _connecterType = -1;
    
    // [2]
     @property({type:Sprite})
     face:Sprite = null;
    @property({type:SpriteFrame})
     frames:SpriteFrame[] = [];
    init(type, creator, id,customEventData=null) {
        
        this._type = type;
        if (this._type == "connector") {
            if (customEventData) {
                this._connecterType = parseInt(customEventData);
     
                this.face.spriteFrame = this.frames[this._connecterType-1];
            }
        } 
              
        this._game = creator;
        this.index = id;
    }
 
    setData(data) {
        this.index = data["id"];
        this.node.position = data["position"];
        this._type = data["type"];
       
        this._data = data;
       
       
    }
    SelectBlock(){
        this._game.SelectBlock(this);
    }
    setUpData() {
        if (this._data) {
            if (this._data["placedItem"]) {
              
                for (let i = 0; i < this._game.spiders.length; i++) {
                    if (this._game.spiders[i]._type == this._data["placedItem"]["type"] && (this._game.spiders[i].index == this._data["placedItem"]["id"])){
                        this._placedItem =this._data["placedItem"];
                        this._game.spiders[i].node.parent = this.node;
                        this._game.spiders[i].node.worldPosition = this.node.worldPosition;
                        break;
                    }
                }
                if (!this._placedItem) {
                     for (let i = 0; i < this._game.bettles.length; i++) {
                    if (this._game.bettles[i]._type == this._data["placedItem"]["type"] && (this._game.bettles[i].index == this._data["placedItem"]["id"])){
                        this._placedItem =this._data["placedItem"];
                        this._game.bettles[i].node.parent = this.node;
                        this._game.bettles[i].node.worldPosition = this.node.worldPosition;
                 
                        break;
                    }
                }
                }
            }
         
                for (let i = 0; i < this._game.connectors.length; i++) {
                    if (this._data["connectedConnector"]&&this._game.connectors[i].index == this._data["connectedConnector"]) {
                        this._connectedConnector = this._game.connectors[i];
                    }
                }
            
            
            let connectors = this._data["connectors"];
            if(connectors)
            {  for (let i = 0; i < this._game.connectors.length; i++) {
                  for (let j = 0; j <connectors.length; j++) {
           
                      if (connectors[j]["index"]==(this._game.connectors[i].index))
                          this.connectors.push({ "connector":this._game.connectors[i],"wireType":connectors[j]["wireType"] });
                  }
            }
            }
             if( this._data["connecterType"])
       { this._connecterType =  this._data["connecterType"];
         this.face.spriteFrame = this.frames[this._connecterType-1];
        }
        
        }
    }
    getData() {
        let data = {};
        data["id"] = this.index;
        if (this._placedItem) {
            data["placedItem"] = { "type": this._placedItem._type, "id": this._placedItem.index };
        }
        if (this.connectors.length > 0) {
            let connectors = [];
            for (let i = 0; i < this.connectors.length; i++)
                connectors.push({ "index":this.connectors[i]["connector"].index, "wireType":  this.connectors[i]["wireType"] });
            
            data["connectors"] = connectors;
        }
        if (this._connectedConnector) {
            data["connectedConnector"] = this._connectedConnector.index;
        }
        data["type"] = this._type;
        data["position"] = this.node.position;
        if(this._connecterType>=0)
        data["connecterType"] = this._connecterType;
        return data;
    }
    start () {
        // [3]
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
