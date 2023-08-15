
import { _decorator, Component, Node,Vec3,Vec2,Graphics,instantiate,UITransform, Sprite, Color, EditBox } from 'cc';
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
    button: Node = null;
    @property({ type: Node })
    portal: Node = null;
    buttons = [];
    _button: Node = null;
    portals = [];
    _portal: Node = null;
      @property({ type: Node })
      bettle: Node = null;
      @property({ type: Node })
      connector: Node = null;
    @property({ type: Graphics })
    graphics: Graphics = null;
    _wireType = 0;// 0 is normal, britle, unbreakable
    connectors = [];
    spiders = [];
   
    bettles = [];
    _connector: Node = null;
    _spider: Node = null;
    _bettle: Node = null;
    
    _movingconnector: Node = null;
    _levelNumber = 0;
    _selectedChild = null;
    _previousPortal=null;
    _portalCount=0;
    commands=[];
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
                this.spiders.splice(i,1);
            }
        }
    }
    removePortal(index){
        for(let i=0;i<this.portals.length;i++){
            if(this.portals[i].index==index){
                if(this.portals[i]._connectedConnector){
                    this.portals[i]._connectedConnector._portal=null;
                    this.portals[i]._connectedConnector=null;
                }
                this.portals[i].node.destroy();
                this.portals.splice(i,1);
            }
        }
    }
    removeBettle(index){
        for(let i=0;i<this.bettles.length;i++){

            if(this.bettles[i].index==index){
                if(this.bettles[i]._connectedConnector){
                    this.bettles[i]._connectedConnector._placedItem=null;
                    this.bettles[i]._connectedConnector=null;
                }
                this.bettles[i].node.destroy();
                this.bettles.splice(i,1);
            }
        }
    }
    removeButton(index){
        for(let i=0;i<this.buttons.length;i++){

            if(this.buttons[i].index==index){
                if(this.buttons[i]._connectedConnector){
                    this.buttons[i]._connectedConnector._holdingButton=null;
                    this.removeConnector(this.buttons[i]._buttonConnector);
                    this.buttons[i]._buttonConnector=null;
                    this.buttons[i]._connectedConnector=null;
                    
                }
                this.buttons[i].node.destroy();
                this.buttons.splice(i,1);
            }
        }
    }
    removeConnector(index){
        for(let i=0;i<this.connectors.length;i++){
            if(this.connectors[i].index==index){
                if(this.connectors[i]._placedItem){
                    if(this.connectors[i]._placedItem.type=="spider"){
                        this.removeSpider(this.connectors[i]._placedItem.index);
                    }else{
                        this.removeBettle(this.connectors[i]._placedItem.index);
                    }
                    this.connectors[i]._placedItem=null;
                }
                if(this.connectors[i]._holdingButton){
                    this.removeButton(this.connectors[i]._holdingButton);
                }
                if(this.connectors[i]._portal){
                    this.removePortal(this.connectors[i]._portal);
                }
                this.connectors[i].node.destroy();
                this.connectors.splice(i,1);
            }
        }
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
                let index=this.connectors.indexOf(this._connector);
                this.connectors.splice(index,1);
                this._connector.destroy();
                this._connector=null;
            }
           // this.connectAll();
        } else if (this._spider) {
             this._spider.worldPosition =  new Vec3(event.getUILocationX(),event.getUILocationY(),0);
             if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._spider.worldPosition.x,this._spider.worldPosition.y)))
        {
            let index=this.spiders.indexOf(this._spider);
            this.spiders.splice(index,1);
            this._spider.destroy();
            this._spider=null;
        }
        } else if (this._bettle) {
             this._bettle.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
             if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._bettle.worldPosition.x,this._bettle.worldPosition.y)))
             {
                 let index=this.bettles.indexOf(this._bettle);
                 this.bettles.splice(index,1);
                 this._bettle.destroy();
                 this._bettle=null;
             }
        } else if (this._button) {
            this._button.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
            if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._button.worldPosition.x,this._button.worldPosition.y)))
            {
                let index=this.buttons.indexOf(this._button);
                this.buttons.splice(index,1);
                this._button.destroy();
                this._button=null;
            }
       }else if (this._portal) {
        this._portal.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
        if(this.trash._uiProps.uiTransformComp.isHit(new Vec2(this._portal.worldPosition.x,this._portal.worldPosition.y)))
        {
            let index=this.buttons.indexOf(this._portal);
            this.portals.splice(index,1);
            this._portal.destroy();
            this._portal=null;
        }
   }
     
    }
    
    dropElement(event) {
        if (this._connector) {
            let element = this._connector;
            this._connector.worldPosition = this._selectedChild.worldPosition;;
            this._connector.on(Node.EventType.TOUCH_START, () => {
                if (!this._spider && !this._bettle&&!this._button&&!this._portal)
                {    this._connector = element;
                    
                
                }else
                    this.dropItem(element.getComponent(Element));
                
          
            }, this);
            this.addMove({elementType:"connector",id:this._connector.getComponent(Element).index});
    
            this._connector = null;
           // this.connectAll();
        }
    } 
    dropItem(element) {
        
    
    if(this._spider) {

        element._placedItem = this._spider.getComponent(Element);
        this._spider.parent = element.node;
        this._spider.position = new Vec3(0, 0, 0);
                    this._spider.getComponent(Element)._connectedConnector = element;
                    
              
                   
                       this.addMove({elementType:"spider",id:this._spider.getComponent(Element).index});
    
                       this._spider = null;
                  
            
        }  if (this._bettle) {
            element._placedItem = this._bettle.getComponent(Element);
             this._bettle.parent = element.node;
        this._bettle.position = new Vec3(0, 0, 0);
                    this._bettle.getComponent(Element)._connectedConnector = element;
             
                  
                     this.addMove({elementType:"bettle",id:this._bettle.getComponent(Element).index});
     
                     this._bettle = null;
           
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
                            }else{
                                this._previousPortal= this._portal.getComponent(Element);
                            }
                             this._portal = null;
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
    createSpider(event,data=null){
      
        this._spider = instantiate(this.spider);
        this._spider.parent = this.node.parent;
        this._spider.getComponent(Element).init("spider", this,this.spiders.length);
        this._spider.active = true;
              this.spiders.push(this._spider.getComponent(Element));
        if (data)
            this._spider.getComponent(Element).setData(data);
       
        return this._spider.getComponent(Element);
    }

    createBettle(event,data=null){
        
        this._bettle = instantiate(this.bettle);
        this._bettle.parent = this.node.parent;
        this._bettle.getComponent(Element).init("bettle", this, this.bettles.length);
          this.bettles.push(this._bettle.getComponent(Element));
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
               spiders.push(element.getData());
           });
           let connectors = [];
           this.connectors.forEach(element => {
               connectors.push(element.getData());
           });
           let bettles = [];
           this.bettles.forEach(element => {
               bettles.push(element.getData());
        });
        let buttons = [];
        this.buttons.forEach(element => {
            buttons.push(element.getData());
     });
     let portals = [];
     this.portals.forEach(element => {
        portals.push(element.getData());
  });
         let  level = {
        "spiders": spiders,
        "connectors": connectors,
        "bettles":bettles,
        "buttons":buttons,
        "portals":portals,
         }
        console.log("level" + JSON.stringify(level));
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([JSON.stringify(level)], {type: "text/plain"}));
        a.download = "level"+this._levelNumber+".json";
        a.click();
        
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
       console.log(content);
       this.resetLevel();
        let connectors = content["connectors"];
       this.connectors = [];

let self=this;
for(let i=0;i<connectors.length;i++){
    let element=connectors[i];
               if(element){
               let connector=self.createConnector(element.type,element);
               connector.node.on(Node.EventType.TOUCH_START, () => {
                if (!self._spider && !self._bettle&&!self._button&&!self._portal)
                {    
                
                    self._connector =  connector.node;
                    
                  
                }else
                    this.dropItem(connector);
                
          
            }, self);
        }
            
          
  }  
       let spiders = content["spiders"];
       this.spiders = [];
       spiders.forEach(element => {
           if (element)
               this.createSpider(null,element);
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
      
       let bettles =  content["bettles"];
       this.bettles = [];
       bettles.forEach(element => {
           if (element)
               this.createBettle(null,element);
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
       this._connector = null;
       this._button = null;
       this._portal = null;
        console.log("level" + this.bettles+","+this.connectors+","+ this.spiders);
   }

}
input.click();

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
            element.node.destroy();
        });
        this.spiders = [];
        this.bettles.forEach(element => {
            element.node.destroy();
        });
          this.bettles = [];
          this.buttons.forEach(element => {
            element.node.destroy();
        });
          this.buttons = [];
          this.portals.forEach(element => {
            element.node.destroy();
        });
          this.portals = [];
        this.connectors.forEach(element => {
            element.node.destroy();
        });
        this.connectors = [];
        this.graphics.clear();
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
