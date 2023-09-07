
import { _decorator, Component, Node,Vec3,Vec2,AsyncDelegate,Graphics,instantiate,UITransform, Sprite, Color, EditBox, SpriteFrame } from 'cc';
import { Element } from './Element';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = LevelCreator
 * DateTime = Sun May 07 2023 00:42:57 GMT+0530 (India Standard Time)
 * Author = Puru
 * FileBasename = LevelCreator.ts
 * FileBasenameNoExtension = LevelCreator
 * URL = db://assets/scripts/LevelCreator.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 

@ccclass('LevelCreator')
export class LevelCreator extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({ type: Node })
    trash: Node = null;
    @property({ type: Node })
      blockParents: Node[] = [];
      @property({ type: Node })
    bg: Node = null;
    @property({ type: Node })
    spider: Node = null;
    @property({ type: Node })
    treasure: Node = null;
    @property({ type: Node })
    button: Node = null;
    @property({ type: Node })
    portal: Node = null;
    @property({ type: Node })
    coin: Node = null;
    @property({ type: Node })
    cookie: Node = null;
    
    treasures = [];
    buttons = [];
    _button: Node = null;
    portals = [];
    _portal: Node = null;
    _coin: Node = null;
    _cookie: Node = null;
      @property({ type: Node })
      bettle: Node = null;
      @property({ type: Node })
      connector: Node = null;
    @property({ type: Graphics })
    graphics: Graphics = null;
    _wireType = 0;// 0 is normal, britle, unbreakable
    connectors = [];
    spiders = [];
    coins = [];
    cookies = [];
    bettles = [];
    _connector: Node = null;
    _spider: Node = null;
    _bettle: Node = null;
    _treasure: Node = null;
    _movingconnector: Node = null;
    _levelNumber = 0;
    _selectedChild = null;
    _previousPortal=null;
    _portalCount=0;
    commands = [];
    protected onDisable(): void {
        this.resetLevel();
    }
    onTextChanged(x,label:EditBox) {
        this._levelNumber = parseInt(label.textLabel.string);
    }
    undoLastMove(){
        if(this.commands.length<=0)
            return;
        let command= this.commands.pop();;
      
        if(command.elementType=="spider"){
            this.removeSpider(command.id);
        }else   if(command.elementType=="bettle"){
            this.removeBettle(command.id);
        }else   if(command.elementType=="connector"){
            this.removeConnector(command.id);
        }else   if(command.elementType=="button"){
            this.removeButton(command.id);
        } else   if(command.elementType=="portal"){
            this.removePortal(command.id);
        }   else   if(command.elementType=="cookie"){
            this.removeCookie(command.id);
        }  else   if(command.elementType=="coin"){
            this.removeCoin(command.id);
        }      else   if(command.elementType=="treasure"){
            this.removeTreasure(command.id);
        }   
    }
    removeSpider(index){
        for(let i=0;i<this.spiders.length;i++){
            if(this.spiders[i].index==index){
                if(this.spiders[i]._connectedConnector){
                    this.spiders[i]._connectedConnector._placedItem=null;
                    this.spiders[i]._connectedConnector=null;
                }
                this.spiders[i].node.destroy();
                this.spiders.splice(i, 1);
                 break;
            }
        }
        for (let i = 0; i < this.spiders.length; i++) {
            this.spiders[i].index = i;
        }
    }
    removePortal(index) {
        let connectedPortal = null;
        for(let i=0;i<this.portals.length;i++){
            if (this.portals[i] && this.portals[i].index == index) {
                
                if (this.portals[i]._connectedConnector) {
                  
                    this.portals[i]._connectedConnector._portal=null;
                    this.portals[i]._connectedConnector=null;
                }
                this.portals[i].node.destroy();
                 connectedPortal = this.portals[i]._connectedPortal;
             

                console.log(this.portals[i].index +"delete portal" );
                this.portals.splice(i, 1);
                 break;
            }
        }
        for (let i = 0; i < this.portals.length; i++) {
            this.portals[i].index = i;
        }
        if (connectedPortal && connectedPortal.node)
            this.removePortal(connectedPortal.index);
      
    }

    removeTreasure(index){
        for(let i=0;i<this.treasures.length;i++){
            if(this.treasures[i]&&this.treasures[i].index==index){
                if(this.treasures[i]._connectedConnector){
                    this.treasures[i]._connectedConnector._portal=null;
                    this.treasures[i]._connectedConnector=null;
                }
                this.treasures[i].node.destroy();
               this.treasures.splice(i, 1);
                 break;
            }
        }
        for (let i = 0; i < this.treasures.length; i++) {
            this.treasures[i].index = i;
        }
    }
    removeBettle(index){
        for(let i=0;i<this.bettles.length;i++){

            if(this.bettles[i]&&this.bettles[i].index==index){
                if(this.bettles[i]._connectedConnector){
                    this.bettles[i]._connectedConnector._placedItem=null;
                    this.bettles[i]._connectedConnector=null;
                }
                this.bettles[i].node.destroy();
               this.bettles.splice(i, 1);
                 break;
            }
        }
        for (let i = 0; i < this.bettles.length; i++) {
            this.bettles[i].index = i;
        }
    }
    removeButton(index){
        for(let i=0;i<this.buttons.length;i++){

            if(this.buttons[i]&&this.buttons[i].index==index){
                if(this.buttons[i]._connectedConnector){
                    this.buttons[i]._connectedConnector._holdingButton = null;
                    this.removeConnector(this.buttons[i]._buttonConnector.index);
                    
                    
                }
                this.buttons[i].node.destroy();
                 this.buttons.splice(i, 1);
                 break;
            }
        }
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].index = i;
        }
    }
    removeCoin(index){
        for(let i=0;i<this.coins.length;i++){

            if(this.coins[i]&&this.coins[i].index==index){
                if(this.coins[i]._connectedConnector){
                    this.coins[i]._connectedConnector._holdingCoin=null;
                    this.coins[i]._connectedConnector=null;
                    
                }
                this.coins[i].node.destroy();
              this.coins.splice(i, 1);
                 break;
            }
        }
        for (let i = 0; i < this.coins.length; i++) {
            this.coins[i].index = i;
        }
    }
    removeCookie(index){
        for(let i=0;i<this.cookies.length;i++){

            if(this.cookies[i]&&this.cookies[i].index==index){
                if(this.cookies[i]._connectedConnector){
                    this.cookies[i]._connectedConnector._holdingCookie=null;
                    this.cookies[i]._connectedConnector=null;
                    
                }
                this.cookies[i].node.destroy();
            this.cookies.splice(i, 1);
                 break;
            }
        }
        for (let i = 0; i < this.cookies.length; i++) {
            this.cookies[i].index = i;
        }
    }
    removeConnector(index){
        for (let i = 0; i < this.connectors.length; i++) {
            if (this.connectors[i]&&this.connectors[i].index == index) {
                if ( this.connectors[i]._placedItem) {
                    if (this.connectors[i]._placedItem._type == "spider") {
                        this.removeSpider(this.connectors[i]._placedItem.index);
                   
                    } else {
                        this.removeBettle(this.connectors[i]._placedItem.index);
                              
                    }
                    
                    this.connectors[i]._placedItem = null;
                }
                
                if (this.connectors[i]._holdingButton) {
                    this.removeButton(this.connectors[i]._holdingButton.index);
                }
                if (this.connectors[i]._portal) {
                    this.removePortal(this.connectors[i]._portal.index);
                }
                if (this.connectors[i]._holdingCoin) {
                    this.removeCoin(this.connectors[i]._holdingCoin.index);
                }
                if (this.connectors[i]._holdingCookie) {
                    this.removeCookie(this.connectors[i]._holdingCookie.index);
                }
                if (this.connectors[i]._holdingTreasure) {
                    this.removeTreasure(this.connectors[i]._holdingTreasure.index);
                }
                for (let i = 0; i < this.buttons.length; i++) {

                    if (this.buttons[i]._connectedConnector.index == this.connectors[i].index) {
                            this.buttons[i]._connectedConnector._holdingButton = null;
                            this.buttons[i]._buttonConnector = null;

                     }
                        this.buttons[i].node.destroy();
                        this.buttons.splice(i, 1);
                        break;
                    
                }
                for (let i = 0; i < this.buttons.length; i++) {
                    this.buttons[i].index = i;
                }
                this.connectors[i].node.destroy();
                this.connectors.splice(i, 1);
                 break;
            }
        }
        for (let i = 0; i < this.connectors.length; i++) {
            this.connectors[i].index = i;
        }
         console.log("trash connectors count" + this.connectors.length);
    }

    addMove(command){
      
        this.commands.push(command);
       
    }
    start () {
        // [3]
        this.bg.on(Node.EventType.MOUSE_MOVE, this.moveElement, this);
        this.blockParents.forEach(element => {
            element.children.forEach(child => {
                child.on(Node.EventType.TOUCH_START, (event) => {
                    this._selectedChild = child;
                    this.dropElement(event);
                    
                 }, this);
   
        });
        });
         }
    setWireType(event, id) {
        this._wireType = id;
    }
    moveElement(event) {
        if (this._connector) {
                  this._connector.off(Node.EventType.TOUCH_START, null, this);
            this._connector.worldPosition = new Vec3(event.getUILocationX(), event.getUILocationY(), 0);
            if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._connector.worldPosition.x,this._connector.worldPosition.y)))
            {
                this.removeConnector(this._connector.getComponent(Element).index);
                this._connector=null;
            }
           // this.connectAll();
        } else if (this._spider) {
             this._spider.worldPosition =  new Vec3(event.getUILocationX(),event.getUILocationY(),0);
             if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._spider.worldPosition.x,this._spider.worldPosition.y)))
        {
            this.removeSpider(this._spider.getComponent(Element).index);;
            this._spider=null;
        }
        } else if (this._bettle) {
             this._bettle.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
             if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._bettle.worldPosition.x,this._bettle.worldPosition.y)))
             {
                this.removeBettle(this._bettle.getComponent(Element).index);
                 this._bettle=null;
             }
        } else if (this._button) {
            this._button.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
            if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._button.worldPosition.x,this._button.worldPosition.y)))
            {
                    this.removeButton(this._button.getComponent(Element).index);
                this._button=null;
            }
       }else if (this._portal) {
        this._portal.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
        if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._portal.worldPosition.x,this._portal.worldPosition.y)))
        {
            this.removePortal(this._portal.getComponent(Element).index);
            this._portal=null;
        }
   }else if (this._treasure) {
    this._treasure.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
    if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._treasure.worldPosition.x,this._treasure.worldPosition.y)))
    {
        this.removeTreasure(this._treasure.getComponent(Element).index);
        this._treasure=null;
    }
        }else if (this._cookie) {
    this._cookie.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
    if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._cookie.worldPosition.x,this._cookie.worldPosition.y)))
    {
        this.removeCookie(this._cookie.getComponent(Element).index);
        this._cookie=null;
    }
}else if (this._coin) {
    this._coin.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
    if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._coin.worldPosition.x,this._coin.worldPosition.y)))
    {
        this.removeCoin(this._coin.getComponent(Element).index);
        this._coin=null;
    }
}
     
    }
    
    dropElement(event) {
        if (this._connector) {
            let element = this._connector;
            this._connector.worldPosition = this._selectedChild.worldPosition;;
            this._connector.on(Node.EventType.TOUCH_START, () => {
                if (!this._spider && !this._bettle && !this._button && !this._portal && !this._coin && !this._cookie && !this._treasure) {
                    this._connector = element;
                    console.log("pick up connector" + this._connector.getComponent(Element).index);
          
                
                } else {
                    this.dropItem(element.getComponent(Element));
                 
                }
          
            }, this);
            if (this._connector) {
                this.addMove({ elementType: "connector", id: this._connector.getComponent(Element).index });
                console.log("drop connector" + this._connector.getComponent(Element).index);
            }
            this._connector = null;
           // this.connectAll();
        }
    } 
    dropItem(element) {
        
     console.log("drop item on connector" + element.getComponent(Element).index);
          
    if(this._spider) {

        element._placedItem = this._spider.getComponent(Element);
        this._spider.parent = element.node;
        this._spider.position = new Vec3(0, 0, 0);
                    this._spider.getComponent(Element)._connectedConnector = element;
                    
              
                   
                       this.addMove({elementType:"spider",id:this._spider.getComponent(Element).index});
    
                       this._spider = null;
                  
        return;
        }

        if (this._bettle) {
            element._placedItem = this._bettle.getComponent(Element);
             this._bettle.parent = element.node;
             this._bettle.position = new Vec3(0, 0, 0);
             this._bettle.getComponent(Element)._connectedConnector = element;
             this.addMove({elementType:"bettle",id:this._bettle.getComponent(Element).index});
            this._bettle = null;
            return;
           
        }
        if (this._coin) {
        
            element._holdingCoin = this._coin.getComponent(Element);
             this._coin.parent = element.node;
            this._coin.position = new Vec3(0, 0, 0);
                    this._coin.getComponent(Element)._connectedConnector = element;
             
                  
                     this.addMove({elementType:"coin",id:this._coin.getComponent(Element).index});
            console.log("drop coin" + this._coin.getComponent(Element).index);            this._coin = null;
            return;
           
        }
        if (this._cookie) {
            element._holdingCookie = this._cookie.getComponent(Element);
             this._cookie.parent = element.node;
             this._cookie.position = new Vec3(0, 0, 0);
                    this._cookie.getComponent(Element)._connectedConnector = element;
             
                  
                     this.addMove({elementType:"cookie",id:this._cookie.getComponent(Element).index});
     
            this._cookie = null;
            return;
           
        }
        if (this._treasure) {
            element._holdingTreasure = this._treasure.getComponent(Element);
             this._treasure.parent = element.node;
        this._treasure.position = new Vec3(0, 0, 0);
                    this._treasure.getComponent(Element)._connectedConnector = element;
             
                  
                     this.addMove({elementType:"treasure",id:this._treasure.getComponent(Element).index});
     
            this._treasure = null;
            return;
           
        }
        if (this._button) {
            element._holdingButton = this._button.getComponent(Element);
             this._button.parent = element.node;
        this._button.position = new Vec3(0, 0, 0);
                    this._button.getComponent(Element)._connectedConnector = element;
                    this._button.getComponent(Element)._connectedConnector._holdingButton= this._button.getComponent(Element);
                    this._button.getComponent(Element)._connectedConnector.text.string= ""+this._button.getComponent(Element).index;
                     this.addMove({elementType:"button",id:this._button.getComponent(Element).index});
     ;
                     this._button.getComponent(Element)._buttonConnector= this.createConnectorNow(null,"4");
                     this._button.getComponent(Element)._buttonConnector.setHidden(true);
                     this._button.getComponent(Element)._buttonConnector.text.string= ""+this._button.getComponent(Element).index;
            this._button = null;
            return;
                   
                }
                if (this._portal) {
                    element._portal = this._portal.getComponent(Element);
                     this._portal.parent = element.node;
                        this._portal.position = new Vec3(0, 0, 0);
                            this._portal.getComponent(Element)._connectedConnector = element;
                            this._portal.getComponent(Element)._connectedConnector._portal= this._portal.getComponent(Element);
                             this.addMove({elementType:"portal",id:this._portal.getComponent(Element).index});
                            if(this._previousPortal){
                                this._portal.getComponent(Element)._connectedPortal=this._previousPortal;
                                this._portal.getComponent(Element)._connectedConnector.text.string=this._portalCount+"";
                                this._previousPortal._connectedPortal= this._portal.getComponent(Element);
                                this._previousPortal._connectedConnector.text.string=this._portalCount+"";
                                this._portalCount++;
                                this._previousPortal = null;
                            }else{
                                this._previousPortal= this._portal.getComponent(Element);
                            }
                    this._portal = null;
                    return;
                    }
    }

    createButton(event,data=null){
        this._button = instantiate(this.button);
        this._button.parent = this.node.parent;
        this._button.getComponent(Element).init("button", this,this.buttons.length);
        this._button.active = true;
              this.buttons.push(this._button.getComponent(Element));
        if (data)
            this._button.getComponent(Element).setData(data);
       
        return this._button.getComponent(Element);
    }
    createSpider(event,customEventData: string=null,data=null){
      
       
        this._spider = instantiate(this.spider);
        this._spider.parent = this.node.parent;
        this._spider.getComponent(Element).init("spider", this,this.spiders.length);
         if (customEventData&&customEventData == "trapped") {
            this._spider.getComponent(Element).setTrapped(true);
        }
        this._spider.active = true;
              this.spiders.push(this._spider.getComponent(Element));
        if (data)
            this._spider.getComponent(Element).setData(data);
       
        return this._spider.getComponent(Element);
    }

    createBettle(event,customEventData: string=null,data=null){
        
        this._bettle = instantiate(this.bettle);
        this._bettle.parent = this.node.parent;
        this._bettle.getComponent(Element).init("bettle", this, this.bettles.length);
          this.bettles.push(this._bettle.getComponent(Element));
        if (customEventData&&customEventData == "trapped") {
            this._bettle.getComponent(Element).setTrapped(true);
        }
        this._bettle.active = true;
         if (data)
            this._bettle.getComponent(Element).setData(data);
      
        return this._bettle.getComponent(Element);
    }
    createConnectorNow(event, customEventData: string){
        return this.createConnector(customEventData);
    }
    createConnector( customEventData: string,data=null){
       
        this._connector = instantiate(this.connector);
        this._connector.parent = this.node.parent;
           this._connector.getComponent(Element).init("connector", this, this.connectors.length,customEventData);
         this.connectors.push(this._connector.getComponent(Element));
        this._connector.active = true;
        if (data)
            this._connector.getComponent(Element).setData(data);
     
           
        return this._connector.getComponent(Element);
          
    }

     createTreasure(event,data=null){
        this._treasure = instantiate(this.treasure);
        this._treasure.parent = this.node.parent;
        this._treasure.getComponent(Element).init("treasure", this, this.treasures.length);
        this.treasures.push(this._treasure.getComponent(Element));
        this._treasure.active = true;
        if (data)
            this._treasure.getComponent(Element).setData(data);
        return this._treasure.getComponent(Element);
          
     }
    
    createCookie(event,data=null){
        this._cookie = instantiate(this.cookie);
        this._cookie.parent = this.node.parent;
        this._cookie.getComponent(Element).init("cookie", this, this.cookies.length);
         this.cookies.push(this._cookie.getComponent(Element));
          this._cookie.active = true;
          if (data)
            this._cookie.getComponent(Element).setData(data);
        return this._cookie.getComponent(Element);
          
    }
    
    createCoin(event,data=null){
        this._coin = instantiate(this.coin);
        this._coin.parent = this.node.parent;
        this._coin.getComponent(Element).init("coin", this, this.coins.length);
         this.coins.push(this._coin.getComponent(Element));
          this._coin.active = true;
          if (data)
            this._coin.getComponent(Element).setData(data);
        return this._coin.getComponent(Element);
          
    }
      createPortal(event,data=null){
        this._portal = instantiate(this.portal);
        this._portal.parent = this.node.parent;
        this._portal.getComponent(Element).init("portal", this, this.portals.length);
         this.portals.push(this._portal.getComponent(Element));
          this._portal.active = true;
          if (data)
            this._portal.getComponent(Element).setData(data);
        return this._portal.getComponent(Element);
          
    }
    selectConnector(connector) {
        this._connector = null;
        if (!this._movingconnector)
       {     this._movingconnector = connector;}
        else {
            this._movingconnector.getComponent(Element).connectors.push({ "connector":connector,"wireType":this._wireType });
            connector.connectors.push({ "connector":this._movingconnector,"wireType":this._wireType });
           // this.connectAll();
            this._movingconnector = null;
        }
    }
    connectAll() {
        this.graphics.clear();
        this.connectors.forEach(connector => {
                    connector.connectors.forEach(element => {
                this.connectConnectors(connector, element.connector,element.wireType);
            });
        });
    }

    connectConnectors(connector1,connector2,wireType) {
        this.graphics.lineWidth = 1.5;
        switch (wireType) {
            case "1":  this.graphics.strokeColor=Color.RED;break;
            case "2": this.graphics.strokeColor = Color.GREEN; break;
                default: this.graphics.strokeColor=Color.WHITE
        }
        
         this.graphics.moveTo(connector1.node.position.x, connector1.node.position.y);
         this.graphics.lineTo(connector2.node.position.x, connector2.node.position.y);
        
        this.graphics.close();
        this.graphics.stroke();
         this.graphics.fill();
    }
    saveLevel() {
        let spiders = [];
        this.spiders.forEach(element => {
               if(element&&element.node)
               spiders.push(element.getData());
           });
           let connectors = [];
        this.connectors.forEach(element => {
               if(element&&element.node)
               connectors.push(element.getData());
           });
           let bettles = [];
        this.bettles.forEach(element => {
              if(element&&element.node)
               bettles.push(element.getData());
        });
        let buttons = [];
        this.buttons.forEach(element => {
              if(element&&element.node)
            buttons.push(element.getData());
     });
     let coins = [];
        this.coins.forEach(element => {
          if(element&&element.node)
        coins.push(element.getData());
  });
  let cookies = [];
        this.cookies.forEach(element => {
       if(element&&element.node)
    cookies.push(element.getData());
});
     let portals = [];
        this.portals.forEach(element => {
          if(element&&element.node)
        portals.push(element.getData());
     });
         let treasures = [];
        this.treasures.forEach(element => {
       if(element&&element.node)
    treasures.push(element.getData());
});
         let  level = {
        "spiders": spiders,
        "connectors": connectors,
        "bettles":bettles,
        "buttons":buttons,
        "portals":portals,
        "coins":coins,
        "cookies": cookies,
        "treasures":treasures
         }
       
        this.loadFolder("level" + this._levelNumber + ".json",JSON.stringify(level));
        
   
    }
    async loadFolder(name,value) {
           
 const opts = {
    types: [
      {
        suggestedName: name,
        accept: { "text/plain": [".json"] },
      },
    ],
 };
 

    const handle = await window.showSaveFilePicker(opts);
    const writable = await handle.createWritable();
 
    await writable.write(value);
    await writable.close();
 
        return handle;
       

          
    }
    

    loadFile() {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => { 

   // getting a hold of the file reference
   var file = e.target.files[0]; 

   // setting up the reader
   var reader = new FileReader();
   reader.readAsText(file,'UTF-8');

   // here we tell the reader what to do when it's done reading...
   reader.onload = readerEvent => {
      var content =JSON.parse(readerEvent.target.result); // this is the content!
       //console.log(content);
       this.resetLevel();
        let connectors = content["connectors"];
       this.connectors = [];
;   this._movingconnector = null;
       this._spider = null;
       this._bettle = null;
       this._button = null;
       this._portal = null;
       this._coin = null;
       this._cookie = null;
        this._treasure = null;
       this._connector = null;
let self=this;
for(let i=0;i<connectors.length;i++){
    let element=connectors[i];
               if(element){
               let connector=self.createConnector(element.type,element);
               connector.node.on(Node.EventType.TOUCH_START, () => {
                   //console.log("touch connector"+self._spider +self._bettle +self._button +self._portal +self._cookie +self._coin + self._treasure);
                   if (!self._spider && !self._bettle && !self._button && !self._portal && !self._cookie && !self._coin && !self._treasure)
                {    

                       console.log("pick up connector" + connector.getComponent(Element).index);
                       self._connector = connector.node;
          
                    
                  
                   } else {
                       console.log("drop item  on connector" + connector.getComponent(Element).index);
                       this.dropItem(connector);
                      
          
                   }
                
          
            }, self);
        }
            
          
       }  
       console.log("connectors count" + this.connectors.length);
       let spiders = content["spiders"];
       this.spiders = [];
       spiders.forEach(element => {
           if (element)
               this.createSpider(null,null,element);
           });
           let buttons = content["buttons"];
           if(buttons)
          { this.buttons = [];
           buttons.forEach(element => {
               if (element)
                   this.createButton(null,element);
               });}
               let portals = content["portals"];
               if(portals)
               {this.portals = [];
               portals.forEach(element => {
                   if (element)
                       this.createPortal(null,element);
                   });}
                   let cookies = content["cookies"];
                   if(cookies)
                   {this.cookies = [];
                    cookies.forEach(element => {
                       if (element)
                           this.createCookie(null,element);
                    });
                   }
                let treasures = content["treasures"];
                   if(treasures)
                   {this.treasures = [];
                    treasures.forEach(element => {
                       if (element)
                           this.createTreasure(null,element);
                       });}
                       let coins = content["coins"];
                       if(coins)
                       {this.coins = [];
                        coins.forEach(element => {
                           if (element)
                               this.createCoin(null,element);
                           });}
      
       let bettles =  content["bettles"];
       this.bettles = [];
       bettles.forEach(element => {
           if (element)
               this.createBettle(null,null,element);
       });
       for(let i=0;i<this.connectors.length;i++){
        this.connectors[i].setUpData();
       }
       for(let i=0;i<this.spiders.length;i++){
        this.spiders[i].setUpData();
       }
       for(let i=0;i<this.buttons.length;i++){
        this.buttons[i].setUpData();
       }
       for(let i=0;i<this.bettles.length;i++){
        this.bettles[i].setUpData();
       }
       for(let i=0;i<this.portals.length;i++){
        this.portals[i].setUpData();
       }
       for(let i=0;i<this.coins.length;i++){
        this.coins[i].setUpData();
       }
       for(let i=0;i<this.cookies.length;i++){
        this.cookies[i].setUpData();
       }

       for(let i=0;i<this.treasures.length;i++){
        this.treasures[i].setUpData();
       }
      
       let k=0;
       let parsedPortals=[];
       for(let i=0;i<this.portals.length;i++){
        let element=this.portals[i];
        if(parsedPortals.indexOf(element<0)){
            if( element._connectedConnector)
        element._connectedConnector.text.string=""+k;
        if( element._connectedPortal._connectedConnector)
        element._connectedPortal._connectedConnector.text.string=""+k;
        k++;
        parsedPortals.push(element);
        parsedPortals.push( element._connectedPortal);
        }
       }
         
      
       // this.connectAll();
     this._movingconnector = null;
       this._spider = null;
       this._bettle = null;
       this._button = null;
       this._portal = null;
       this._coin = null;
       this._cookie = null;
        this._treasure = null;
        //console.log("level" + this.bettles+","+this.connectors+","+ this.spiders);
   }

}
input.click();

    }
    clear() {
           this._movingconnector = null;
       this._spider = null;
       this._bettle = null;
       this._button = null;
       this._portal = null;
       this._coin = null;
       this._cookie = null;
        this._treasure = null;
        this._connector = null;
          this.treasures = [];
     this.buttons = [];
     this.portals = [];
     this.connectors = [];
     this.spiders = [];
     this.coins = [];
     this.cookies = [];
     this.bettles = [];
     this._levelNumber = 0;
     this._selectedChild = null;
     this._previousPortal=null;
     this._portalCount=0;
     this.commands = [];
        
    }
     readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

    resetLevel() {
        this.spiders.forEach(element => {
            if(element&&element.node)
            element.node.destroy();
        });
        this.spiders = [];
        this.bettles.forEach(element => {
            if(element&&element.node)
            element.node.destroy();
        });
          this.bettles = [];
        this.buttons.forEach(element => {
              if(element&&element.node)
            element.node.destroy();
        });
          this.buttons = [];
        this.portals.forEach(element => {
              if(element&&element.node)
            element.node.destroy();
        });
          this.portals = [];
        this.connectors.forEach(element => {
            if(element&&element.node)
            element.node.destroy();
        });
        this.connectors = [];
        this.cookies.forEach(element => {
            if(element&&element.node)
            element.node.destroy();
        });
        this.cookies = [];
        this.coins.forEach(element => {
            if(element&&element.node)
            element.node.destroy();
        });
        this.coins = [];
        this.graphics.clear();
        this.clear();
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
