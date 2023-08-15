
import { _decorator, Color, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
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
    _buttonConnector = null;
    _holdingButton=null;
    _portal=null;
    _connectedPortal=null;
    index = -1;
    _data = null;
    _connecterType = -1;
    _hidden=false;
    // [2]
    @property({type:Label})
    text:Label = null;
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
              
        this._creator = creator;
        this.index = id;
    }
 
    setData(data) {
        this.index = data["id"];
        this.node.position = data["position"];
        this._type = data["type"];
        if(data["hidden"])
        this.setHidden(data["hidden"]);
        this._data = data;
       
       
    }
    setUpData() {
        if (this._data) {
            if (this._data["placedItem"]) {
              
                for (let i = 0; i < this._creator.spiders.length; i++) {
                    if (this._creator.spiders[i]._type == this._data["placedItem"]["type"] && (this._creator.spiders[i].index == this._data["placedItem"]["id"])){
                        this._placedItem =this._creator.spiders[i];
                        this._creator.spiders[i].node.parent = this.node;
                        this._creator.spiders[i].node.worldPosition = this.node.worldPosition;
                        break;
                    }
                }
                if (!this._placedItem) {
                     for (let i = 0; i < this._creator.bettles.length; i++) {
                    if (this._creator.bettles[i]._type == this._data["placedItem"]["type"] && (this._creator.bettles[i].index == this._data["placedItem"]["id"])){
                        this._placedItem = this._creator.bettles[i];
                        this._creator.bettles[i].node.parent = this.node;
                        this._creator.bettles[i].node.worldPosition = this.node.worldPosition;
                 
                        break;
                    }
                }
                }
            }
            if (this._data["holdingButton"]) {
                for (let i = 0; i < this._creator.buttons.length; i++) {
                    if (this._creator.buttons[i]._type == this._data["holdingButton"]["type"] && (this._creator.buttons[i].index == this._data["holdingButton"]["id"])){
                        this._holdingButton = this._creator.buttons[i];
                        this.text.string= ""+this._creator.buttons[i].index;
                        this._creator.buttons[i].node.parent = this.node;
                        this._creator.buttons[i].node.worldPosition = this.node.worldPosition;
                 
                        break;
                    }
                }
            }
            if (this._data["portal"]) {
              
                for (let i = 0; i < this._creator.portals.length; i++) {
                    if (this._creator.portals[i]._type == this._data["portal"]["type"] && (this._creator.portals[i].index == this._data["portal"]["id"])){
                        this._portal = this._creator.portals[i];
                       
                        this._creator.portals[i].node.parent = this.node;
                        this._creator.portals[i].node.worldPosition = this.node.worldPosition;
                 
                        break;
                    }
                }
            }
           
         
               
            
            
            let connectors = this._data["connectors"];
            if(connectors)
            {  for (let i = 0; i < this._creator.connectors.length; i++) {
                  for (let j = 0; j <connectors.length; j++) {
           
                      if (connectors[j]["index"]==(this._creator.connectors[i].index))
                          this.connectors.push({ "connector":this._creator.connectors[i],"wireType":connectors[j]["wireType"] });
                  }
            }

            }
            if (this._data["connectedPortal"]) {
               
                for (let i = 0; i < this._creator.portals.length; i++) {
                    if ( this._creator.portals[i].index == this._data["connectedPortal"]){
                        this._connectedPortal = this._creator.portals[i];
                        this._creator.portals[i]._connectedPortal=this;;
                        
                    }
                }
            }
            if(this._type=="button"||this._type=="portal")
            console.log("has"+JSON.stringify(this._data));
            
                if (this._data["connectedConnector"]!=null) {
                    console.log("has connectedConnector"+this._data["connectedConnector"]);
                    this._connectedConnector = this._creator.connectors[this._data["connectedConnector"]];
                }
                if (this._data["buttonConnector"]!=null) {
                    console.log("has buttonConnector"+this._data["buttonConnector"]);
              
                    this._buttonConnector = this._creator.connectors[this._data["buttonConnector"]];
                    this._creator.connectors[this._data["buttonConnector"]].text.string=""+this.index;
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
        if (this._holdingButton) {
            data["holdingButton"] = { "type": this._holdingButton._type, "id": this._holdingButton.index};
                }
          if (this._portal) {
            data["portal"] = { "type": this._portal._type, "id": this._portal.index};
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
        if (this._buttonConnector) {
            data["buttonConnector"] = this._buttonConnector.index;
        }
        if (this._connectedPortal) {
            data["connectedPortal"] = this._connectedPortal.index;
        }
        data["hidden"] = this._hidden;
        data["type"] = this._type;
        data["position"] = this.node.position;
        if(this._connecterType>=0)
        data["connecterType"] = this._connecterType;
        return data;
    }
    start () {
        // [3]
    }
    select(value: boolean) {
        this._creator.selectConnector(this);
    }
  

     setHidden(hide) {
    //     // [4]
    this._hidden=hide;
    if(!this._hidden){
        this.node.getComponent(Sprite).color =Color.WHITE;
    }else{
        this.node.getComponent(Sprite).color =new Color(255,255,255,100);
    }
    }
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
