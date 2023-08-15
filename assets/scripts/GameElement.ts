
import { _decorator, Color, Component, Node, Sprite, SpriteFrame } from 'cc';
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
    _buttonConnector = null;
    _holdingButton=null;
    index = -1;
    _data = null;
    _connecterType = -1;
    _hidden=false;
    neighbors=[null,null,null,null];
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
       this.setHidden(data["hidden"]);
        this._data = data;
       
       
    }
    distanceTo(point1,point2)
    {
        var distance = Math.sqrt((Math.pow(point1.x-point2.x,2))+(Math.pow(point1.y-point2.y,2)))
        return distance;
    };
    initializeNeighbours(){
        for(let i=0;i<this._game.connectors.length;i++){
            if(this._game.connectors[i]!=this&&this.distanceTo(this.node.worldPosition,this._game.connectors[i].node.worldPosition)<200){
                if(this.node.worldPosition.x==this._game.connectors[i].node.worldPosition.x){
                    if(this.node.worldPosition.y<this._game.connectors[i].node.worldPosition.y){
                        //top
                        this.neighbors[1]=this._game.connectors[i];
                 
                    }else{
                        //bottom
                        this.neighbors[3]=this._game.connectors[i];
                 
                    }
                }else  if(this.node.worldPosition.y==this._game.connectors[i].node.worldPosition.y){
                    if(this.node.worldPosition.x>this._game.connectors[i].node.worldPosition.x){
                        //left
                        this.neighbors[0]=this._game.connectors[i];
                    }else{
                        //right
                        this.neighbors[2]=this._game.connectors[i];
                 
                    }
             
                }
            }
        }
        
    }
    isANeighbor(block){
        for(let i=0;i<this.neighbors.length;i++){
            if(this.neighbors[i]!=null&&this.neighbors[i]==block){
                return true;
            }
        }
        return false;
    }
    hasAValidNeighbor(bettle){
        if(!this.neighbors)
            return null;
     
        //left,top,bottom,right
        for(let i=0;i<this.neighbors.length;i++){
            if(this.neighbors[i]!=null&&this.neighbors[i]._placedItem&&this.neighbors[i]._placedItem._type=="bettle"&&!this.neighbors[i]._hidden){
                console.log("found bettle");
                return this.neighbors[i];
            }
        }
            let selectedNeighbor=null;
            let minCount=100;
            let directions=["left","top","right","bottom"];
            for(let i=0;i<this.neighbors.length;i++){
                let blocks=[];
                if(this.neighbors[i]&&(this.neighbors[i].isConnectedTo(i,bettle._connectedConnector,blocks)==true)){
                   
                    console.log(directions[i]+"direction found is"+this.neighbors[i].isConnectedTo(i,bettle._connectedConnector,[]));
                    let count=blocks.length;
                    if(count<minCount)
                    {
                        selectedNeighbor=this.neighbors[i];
                        minCount=count;
                    }
                }
            }
          
            return selectedNeighbor;
        
      
    }
    isConnectedTo(direction,targetBlock,parsedBlocks){
        let directions=["left","top","right","bottom"];
        console.log("checking direction "+directions[direction]);
        let value=false;
        if(!this.node||this._hidden){
            return false;
        }
        if(parsedBlocks.indexOf(this)<0){
        if(this==targetBlock)
        return true;
      
        parsedBlocks.push(this);
   
        if(this.neighbors[direction]&&!this.neighbors[direction]._hidden)
        value=value||this.neighbors[direction].isConnectedTo(direction,targetBlock,parsedBlocks)
        
        let otherDirection=0;
        if(direction==0){
            otherDirection=2;
        }else if(direction==2){
            otherDirection=0;
        }else if(direction==1){
            otherDirection=3;
        }else{
            otherDirection=1;
        }

        for(let i=0;i<this.neighbors.length;i++){
            
            if(i!=direction&&i!=otherDirection&&this.neighbors[i]&&!this.neighbors[i]._hidden)
            value=value||this.neighbors[i].isConnectedTo(i,targetBlock,parsedBlocks)
    
        }
        

    }
       // console.log("checking direction return"+value);
      
                 return value;
       
       
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
         
            if (this._data["holdingButton"]) {
                for (let i = 0; i < this._game.buttons.length; i++) {
                    if (this._game.buttons[i]._type == this._data["holdingButton"]["type"] && (this._game.buttons[i].index == this._data["holdingButton"]["id"])){
                        this._holdingButton = this._game.buttons[i];
                        this._game.buttons[i].node.parent = this.node;
                        this._game.buttons[i].node.worldPosition = this.node.worldPosition;
                 
                        break;
                    }
                }
            }
                for (let i = 0; i < this._game.connectors.length; i++) {
                    if (this._data["connectedConnector"]&&this._game.connectors[i].index == this._data["connectedConnector"]) {
                        this._connectedConnector = this._game.connectors[i];
                    }
                    if (this._data["buttonConnector"]&&this._game.connectors[i].index == this._data["buttonConnector"]) {
                        this._buttonConnector = this._game.connectors[i];
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
    
    start () {
        // [3]
    }
  
    setHidden(hide) {
        //     // [4]
        this._hidden=hide;
        if(!this._hidden){
            this.node.getComponent(Sprite).color =Color.WHITE;
        }else{
            this.node.active=false;
        }
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
