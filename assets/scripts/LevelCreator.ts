
import { _decorator, Component, Node,Vec3,Vec2,Graphics,instantiate,UITransform, Sprite, Color } from 'cc';
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
    bg: Node = null;
    @property({ type: Node })
    spider: Node = null;
      @property({ type: Node })
      bettle: Node = null;
      @property({ type: Node })
      connector: Node = null;
    @property({ type: Graphics })
    graphics: Graphics = null;
  
    connectors = [];
    spiders = [];
    bettles = [];
    _connector: Node = null;
    _spider: Node = null;
    _bettle: Node = null;
_movingconnector: Node = null;
    start () {
        // [3]
        this.bg.on(Node.EventType.MOUSE_MOVE, this.moveElement, this);
         this.bg.on(Node.EventType.MOUSE_DOWN, this.dropElement, this);
    }
    moveElement(event) {
        if (this._connector) {
                  this._connector.off(Node.EventType.MOUSE_DOWN, null, this);
            this._connector.worldPosition = new Vec3(event.getUILocationX(), event.getUILocationY(), 0);
             this.connectAll();
        } else if (this._spider) {
             this._spider.worldPosition =  new Vec3(event.getUILocationX(),event.getUILocationY(),0);
      
        } else if (this._bettle) {
             this._bettle.worldPosition = new Vec3(event.getUILocationX(),event.getUILocationY(),0);
      
        }
    }
    
    dropElement(event) {
        if (this._connector) {
            let element = this._connector;
               
            this._connector.on(Node.EventType.MOUSE_DOWN, () => {
                if (!this._spider && !this._bettle)
                    this._connector = element
                else
                    this.dropItem(element.getComponent(Element));
                
          
            }, this);
            this._connector = null;
            this.connectAll();
        }
    } 
    dropItem(element) {
        
    
    if(this._spider) {

        element._placedItem = this._spider.getComponent(Element);
        this._spider.parent = element.node;
        this._spider.position = new Vec3(0, 0, 0);
                    this._spider.getComponent(Element)._connectedConnector = element;
                    
              
                       element.node.getComponent(Sprite).color = Color.GREEN;
                    this._spider = null;
                
              
            
        }  if (this._bettle) {
            element._placedItem = this._bettle.getComponent(Element);
             this._bettle.parent = element.node;
        this._bettle.position = new Vec3(0, 0, 0);
                    this._bettle.getComponent(Element)._connectedConnector = element;
             
                  
                     element.node.getComponent(Sprite).color = Color.GREEN;
                    this._bettle = null;
           
        }
    }
    createSpider(){
        this._spider = instantiate(this.spider);
        this._spider.parent = this.node.parent;
        this._spider.getComponent(Element).init("spider", this,this.spiders.length);
        this._spider.active = true;
              this.spiders.push(this._spider.getComponent(Element));
     
    }

    createBettle(){
        this._bettle = instantiate(this.bettle);
         this._bettle.parent = this.node.parent;
        this._bettle.getComponent(Element).init("bettle", this, this.bettles.length);
          this.bettles.push(this._bettle.getComponent(Element));
        this._bettle.active = true;
    }
    createConnector(){
        this._connector = instantiate(this.connector);
        this._connector.parent = this.node.parent;
        
        this._connector.getComponent(Element).init("connector", this, this.connectors.length);
         this.connectors.push(this._connector.getComponent(Element));
        this._connector.active = true;
          
    }
    selectConnector(connector) {
        this._connector = null;
        if (!this._movingconnector)
       {     this._movingconnector = connector;
        this._movingconnector.getComponent(Sprite).color = Color.GREEN;}
        else {
            connector.getComponent(Sprite).color = Color.GREEN;
            this._movingconnector.getComponent(Element).connectors.push(connector);
             connector.getComponent(Element).connectors.push( this._movingconnector);
            this.connectAll();
            this._movingconnector = null;
        }
    }
    connectAll() {
        this.graphics.clear();
        this.connectors.forEach(connector => {
            connector.getComponent(Sprite).color = Color.WHITE;
            connector.connectors.forEach(element => {
                this.connectConnectors(connector, element);
            });
        });
    }

    connectConnectors(connector1,connector2) {
         this.graphics.lineWidth = 0.98;
         this.graphics.strokeColor.fromHEX('#fffff0');
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
         let  level = {
        "spiders": spiders,
        "connectors": connectors,
        "bettles":bettles,
         }
        console.log("level" + JSON.stringify(level));
        
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
        this.connectors.forEach(element => {
            element.node.destroy();
        });
        this.connectors = [];
        this.graphics.clear();
    }


     update (deltaTime: number) {
    //     // [4]
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
