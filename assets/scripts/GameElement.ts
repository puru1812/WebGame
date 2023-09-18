
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
 
@ccclass('GameElement')
export class GameElement extends Component {
    // [1]
    // dummy = '';
    _type = "";
    _game = null;
    connectors = [];
    _placedItems = [];
    _connectedConnector = null;
    _buttonConnector = null;
    _holdingButton=null;
    _portal=null;
    _connectedPortal=null;
    _holdingCookie = null;
    _holdingTreasure = null;
    _holdingCoin=null;
    index = -1;
    _data = null;
    _connecterType = -1;
    _hidden = false;
    _trapped = false;
    neighbors = [null, null, null, null];
    _sleeping = false;
    // [2]
        @property({type:Node})
     cover:Node = null;
     @property({type:Sprite})
     face:Sprite = null;
    @property({type:SpriteFrame})
    frames: SpriteFrame[] = [];
     @property({type:Label})
     label:Label = null;
    init(type, creator, id,customEventData=null) {
        
        this._type = type;
        if (this._type == "connector") {
            if (customEventData) {
                this._connecterType = parseInt(customEventData);
     
                this.face.spriteFrame = this.frames[this._connecterType - 1];
                if (this._connecterType == 3) {
                    this._game.exitPoints.push(this);
                }
            }
        } 
              
        this._game = creator;
        this.index = id;
        if (this.label)
            this.label.string = "" + id;
    }
 
    setData(data) {
        this._placedItems = [];
        this.index = data["id"];
        this.node.position = data["position"];
        this._type = data["type"];
          if(data["hidden"])
        this.setHidden(data["hidden"]);
         if(data["trapped"])
          this.setTrapped(data["trapped"]);
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
                        this.neighbors[1] = this._game.connectors[i];
                     // console.log(this.index + "top neighbor"+ this._game.connectors[i].index);
                 
                    }else{
                        //bottom
                        this.neighbors[3] = this._game.connectors[i];
                        // console.log(this.index + "bottom neighbor"+ this._game.connectors[i].index);
                 
                    }
                }else  if(this.node.worldPosition.y==this._game.connectors[i].node.worldPosition.y){
                    if(this.node.worldPosition.x>this._game.connectors[i].node.worldPosition.x){
                        //left
                        this.neighbors[0] = this._game.connectors[i];
                        // console.log(this.index + "left neighbor"+ this._game.connectors[i].index);
                    }else{
                        //right
                        this.neighbors[2] = this._game.connectors[i];
                        // console.log(this.index + "right neighbor"+ this._game.connectors[i].index);
                 
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
          for(let i=0;i<block.neighbors.length;i++){
            if(block.neighbors[i]!=null&&block.neighbors[i]==this){
                return true;
            }
        }
        if(this._portal){
            if(this._portal._connectedPortal._connectedConnector==block)
                return true;
        }
        return false;
    }

     hasPlacedItem(type=null) {
         if (!this.node || !this._placedItems)
             return null;
         for (let i = 0; i < this._placedItems.length; i++){
             if (this._placedItems[i]._type == type) {
                 return this._placedItems[i];
             }
         }
         return null;
     }
    hasUnTrappedPlacedItem(type) {
         if (!this.node || !this._placedItems)
             return null;
        for (let i = 0; i < this._placedItems.length; i++){
             if (this._placedItems[i]._type == type&&!this._placedItems[i]._trapped) {
                 return this._placedItems[i];
             }
         }
         return null;
    }
    removePlacedItem(item) {
         if (!this.node || !this._placedItems)
             return null;
        let index = this._placedItems.indexOf(item);
        this._placedItems.splice(index, 1);
    }
    addPlacedItem(item) {
             if (!this.node || !this._placedItems)
             return null;
        if(this._placedItems.indexOf(item)<0)
        this._placedItems.push(item);
    }
    
    hasTrappedPlacedItem(type = null) {
         if (!this.node || !this._placedItems)
             return null;
        for (let i = 0; i < this._placedItems.length; i++){
             if (this._placedItems[i]._type == type&&this._placedItems[i]._trapped) {
                 return this._placedItems[i];
             }
         }
         return null;
    }
    getValidNeighBors() {
        let validNeighBors = [];
        let count = 100;
        //console.log("count getValidNeighBors" + this._game.exitPoints.length )
        for (let i = 0; i < this.neighbors.length; i++) {
           
            if (this.neighbors[i] != null && this.neighbors[i].node) {
                for (let d = 0; d < 4; d++) {
                        for (let k = 0; k < this._game.exitPoints.length; k++) {
                            
                                let blocks = [];
                                this.neighbors[i].isConnectedTo(d, this._game.exitPoints[k], blocks);

                                //console.log(i+"count" + blocks.length)
                                if (blocks.length <= count) {
                                    count = blocks.length;
                                    if (validNeighBors.indexOf(this.neighbors[i]) >= 0) {
                                        validNeighBors.splice(validNeighBors.indexOf(this.neighbors[i]), 1);
                                    }
                                    validNeighBors.unshift(this.neighbors[i]);
                                } else {
                                    if (validNeighBors.indexOf(this.neighbors[i]) < 0) 
                                    validNeighBors.push(this.neighbors[i]);
                                }
                            
                        
                    }
                }
            }
        }
        if (validNeighBors.length>0)
            return [validNeighBors[0]];
        return [];
    }
    
    hasAValidNeighbor(bettle,chosenNeighbors=[]){
        if(!this.neighbors)
            return null;
        
        //left,top,bottom,right
        for(let i=0;i<this.neighbors.length;i++){
            if(this.neighbors[i]!=null&&this.neighbors[i].hasPlacedItem("bettle")&&!this.neighbors[i]._hidden&&this.neighbors[i]._connecterType!=5){
                //console.log("found bettle");
                if(!this.neighbors[i].hasPlacedItem("bettle")._trapped)
                    return this.neighbors[i];

            }
           
        }
        for (let i = 0; i < this.neighbors.length; i++) {
            
            if (this.neighbors[i] != null && bettle._connectedConnector.getValidNeighBors().indexOf(this.neighbors[i]) >= 0)
                return this.neighbors[i];

        }
            let selectedNeighbor=null;
            let minCount=1000;
        let directions = ["left", "top", "right", "bottom"];
        for (let d = 0; d < 4; d++) {
            if (this._portal) {
                let blocks = [];
                //console.log("portal direction found is"+this._portal._connectedPortal._connectedConnector.isConnectedTo(0,bettle._connectedConnector,[]));

                if (this._portal._connectedPortal._connectedConnector && (this._portal._connectedPortal._connectedConnector.isConnectedTo(d, bettle._connectedConnector, blocks) == true)) {

                    let count = this.containsExitBlock(blocks, bettle._connectedConnector);
                    if (count < minCount && chosenNeighbors.indexOf(this._portal._connectedPortal._connectedConnector)<0) {
                        selectedNeighbor = this._portal._connectedPortal._connectedConnector;
                        minCount = count;
                        console.log(count+"select neighbor for portal"  + directions[d]);
                    }
                }
              
                
         
                blocks = [];
                if (bettle._connectedConnector._portal && ((this.isConnectedTo(d, bettle._connectedConnector._portal._connectedPortal._connectedConnector, blocks) == true))) {

                    let count = this.containsExitBlock(blocks, bettle._connectedConnector._portal._connectedPortal._connectedConnector);
                    if (count < minCount && chosenNeighbors.indexOf(this) < 0) {
                        selectedNeighbor = this;
                        minCount = count;
                        console.log(count + "select neighbor for portal" + directions[d]);
                    }
                }
              
           

            }  
            for (let i = 0; i < this.neighbors.length; i++) {
                let blocks = [];
                if (this.neighbors[i] && !this.neighbors[i]._hidden && (this.neighbors[i].isConnectedTo(d, bettle._connectedConnector, blocks) == true) && !this.neighbors[i]._hidden && this.neighbors[i]._connecterType != 5) {

                    //console.log(directions[i]+"direction found is"+this.neighbors[i].isConnectedTo(i,bettle._connectedConnector,[]));
                    let count = this.containsExitBlock(blocks, bettle._connectedConnector);
                    if (count < minCount && chosenNeighbors.indexOf(this.neighbors[i]) < 0) {
                        selectedNeighbor = this.neighbors[i];
                        minCount = count;
                        console.log(count+"select neighbor for portal" +  + directions[d]);
                    }
                }
                blocks = [];
                if (this.neighbors[i] && bettle._connectedConnector._portal && !this.neighbors[i]._hidden&& (this.neighbors[i].isConnectedTo(d, bettle._connectedConnector._portal._connectedPortal._connectedConnector, blocks) == true)) {

                    let count = this.containsExitBlock(blocks, bettle._connectedConnector);
                    if (count < minCount && chosenNeighbors.indexOf(this.neighbors[i]) < 0) {
                        selectedNeighbor = this.neighbors[i];
                        minCount = count;
                        console.log(count + "select neighbor for portal" + directions[d]);
                    }
                }
            }
     
               
        }
        if (!selectedNeighbor) {
            let count = 100;
            for (let j = 0; j < this._game.buttons.length; j++) {
                for (let d = 0; d < 4; d++) {
                  
                    for (let i = 0; i < this.neighbors.length; i++) {
                        let blocks = [];
                        if (this.neighbors[i] && this._game.buttons[j] && !this.neighbors[i]._hidden && (this.neighbors[i].isConnectedTo(d, this._game.buttons[j]._connectedConnector, blocks) == true)) {
                          //  console.log(count + " others select neighbor is in " + directions[d]);
                         
                            if (blocks.length < count) { 
                                count = blocks.length;
                                selectedNeighbor = this.neighbors[i];
                               
                            }
                           
                            
                        }
                    }

                }
            }
        }
     
        if (!selectedNeighbor)
            console.log("did not find valid neighbor");
        else 
            console.log(" found valid neighbor");
            return selectedNeighbor;
        
      
    }
    containsExitBlock(blocks,startblock) {
        let newblocks = [];
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i]._connecterType == 3) {
                this.isConnectedTo(0, startblock, newblocks);
                return Math.floor((newblocks.length + blocks.length)/2);
            }

        }
        return blocks.length;
    }
    isConnectedTo(direction,targetBlock,parsedBlocks){
        let directions=["left","top","right","bottom"];
        //console.log("checking direction "+directions[direction]);
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
        
       
            for (let j = 0; j < 4; j++) {
             
                    if (this._portal)
                        value = value || this._portal._connectedPortal._connectedConnector.isConnectedTo(j, targetBlock, parsedBlocks)
                    if (value == true)
                        return value;
                

        for(let i=0;i<this.neighbors.length;i++){
            
            if (i != direction && this.neighbors[i] && !this.neighbors[i]._hidden)
                value = value || this.neighbors[i].isConnectedTo(j, targetBlock, parsedBlocks);
            if (value == true)
                return value;
    
        }
            }
      
    
    

    }
       // //console.log("checking direction return"+value);
      
                 return value;
       
       
    }
    SelectBlock(){
        this._game.SelectBlock(this);
    }
    

    setUpData() {
        if (this._data) {
            if (this._data["placedItem"]) {
                let found = false;
                for (let i = 0; i < this._game.spiders.length; i++) {
                    if (this._game.spiders[i]._type == this._data["placedItem"]["type"] && (this._game.spiders[i].index == this._data["placedItem"]["id"])){
                        this._placedItems.push(this._game.spiders[i]);
                        this._game.spiders[i].node.parent = this.node;
                        this._game.spiders[i].node.worldPosition = this.node.worldPosition;
                        found = true;
                          //console.log(this._data["placedItem"]["type"] + "connectedConnector" +"in game"+this.index);
             
                        break;
                    }
                }
                if (!found) {
                     for (let i = 0; i < this._game.bettles.length; i++) {
                    if (this._game.bettles[i]._type == this._data["placedItem"]["type"] && (this._game.bettles[i].index == this._data["placedItem"]["id"])){
                        
                        this._placedItems.push(this._game.bettles[i]);
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
            if (this._data["holdingCoin"]) {
                for (let i = 0; i < this._game.coins.length; i++) {
                    if (this._game.coins[i]._type == this._data["holdingCoin"]["type"] && (this._game.coins[i].index == this._data["holdingCoin"]["id"])){
                        this._holdingCoin = this._game.coins[i];
                        this._game.coins[i].node.parent = this.node;
                        this._game.coins[i].node.worldPosition = this.node.worldPosition;
                 
                        break;
                    }
                }
            }
            if (this._data["holdingCookie"]) {
                for (let i = 0; i < this._game.cookies.length; i++) {
                    if (this._game.cookies[i]._type == this._data["holdingCookie"]["type"] && (this._game.cookies[i].index == this._data["holdingCookie"]["id"])){
                        this._holdingCookie = this._game.cookies[i];
                        this._game.cookies[i].node.parent = this.node;
                        this._game.cookies[i].node.worldPosition = this.node.worldPosition;
                 
                        break;
                    }
                }
            }
              if (this._data["holdingTreasure"]) {
                for (let i = 0; i < this._game.treasures.length; i++) {
                    if (this._game.treasures[i]._type == this._data["holdingTreasure"]["type"] && (this._game.treasures[i].index == this._data["holdingTreasure"]["id"])){
                        this._holdingTreasure = this._game.treasures[i];
                        this._game.treasures[i].node.parent = this.node;
                        this._game.treasures[i].node.worldPosition = this.node.worldPosition;
                 
                        break;
                    }
                }
            }
            if (this._data["portal"]) {
              
                for (let i = 0; i < this._game.portals.length; i++) {
                    if (this._game.portals[i]._type == this._data["portal"]["type"] && (this._game.portals[i].index == this._data["portal"]["id"])){
                        this._portal = this._game.portals[i];
                       
                        this._game.portals[i].node.parent = this.node;
                        this._game.portals[i].node.worldPosition = this.node.worldPosition;
                 
                        break;
                    }
                }
            }
            if (this._data["connectedPortal"]) {
               
                for (let i = 0; i < this._game.portals.length; i++) {
                    if ( this._game.portals[i].index == this._data["connectedPortal"]){
                        this._connectedPortal = this._game.portals[i];
                        this._game.portals[i]._connectedPortal=this;;
                        
                    }
                }
            }
            for (let i = 0; i < this._game.connectors.length; i++) {
                      if (this._data["connectedConnector"]!=null&&this._game.connectors[i].index == this._data["connectedConnector"]) {
                          this._connectedConnector = this._game.connectors[i];
                          this.node.worldPosition = this._game.connectors[i].node.worldPosition;
                         
                    }
                    if (this._data["buttonConnector"]!=null&&this._game.connectors[i].index == this._data["buttonConnector"]) {
                        this._buttonConnector = this._game.connectors[i];
                          this.node.worldPosition = this._game.connectors[i].node.worldPosition;
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
                 this.face.spriteFrame = this.frames[this._connecterType - 1];
                 this._game.exitPoints.push(this);
        }
        
        }
    }
    
    start () {
        // [3]
    }

    setTrapped(trapped=false) {
        this._trapped = trapped;
        if (this._trapped) {
            this.cover.active = true;
        } else {
             this.cover.active = false;
        }
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
