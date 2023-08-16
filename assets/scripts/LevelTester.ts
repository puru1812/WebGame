
import {instantiate, _decorator, Component, Node, Label, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { GameElement } from './GameElement';
/**
 * Predefined variables
 * Name = LevelTester
 * DateTime = Tue Aug 08 2023 12:35:54 GMT+0200 (South Africa Standard Time)
 * Author = Puru
 * FileBasename = LevelTester.ts
 * FileBasenameNoExtension = LevelTester
 * URL = db://assets/scripts/LevelTester.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('LevelTester')
export class LevelTester extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    connectors = [];
    spiders = [];
    bettles = [];
    buttons = [];
    portals = [];
    coins = [];
    cookies = [];
    @property({ type: Node })
    coin: Node = null;
    @property({ type: Node })
    cookie: Node = null;
    @property({ type: Node })
    spider: Node = null;
    @property({ type: Node })
    portal: Node = null;
      @property({ type: Node })
      bettle: Node = null;
      @property({ type: Node })
      connector: Node = null;
      @property({ type: Node })
      skipbutton: Node = null;
      @property({ type: Label })
      turnText: Label = null;
      @property({ type: Node })
      gameOverScreen: Node = null;
      @property({ type: Node })
      gameWinScreen: Node = null;
      @property({ type: Node })
      button: Node = null;
     @property({ type: Node })
     bomb: Node = null;
     @property({ type: Node })
     hammer: Node = null;
     @property({ type: Node })
      smokebomb: Node = null;
      @property({ type: Label })
      coinText: Label = null;
      @property({ type: Label })
      cookieText: Label = null;
      @property({ type: Label })
      friendsText: Label = null;
      _button = null;
      _content=null;
      _connector=null
      _spider=null;
      _portal=null;
      _cookie=null;
      _coin=null;
      _bettle=null;
      _playerTurn=true;
      collectedCoins=0;
    collectedCookies = 0;
    _holdingBomb = null;
    _holdingHammer = null;
    _holdingSmoke = null;

    CreateBomb() {
        if (this._holdingBomb||this._holdingHammer||this._holdingSmoke)
            return;
        this._holdingBomb = instantiate(this.bomb);
        this._holdingBomb.active = true;
        this._holdingBomb.parent = this.node;
        this._holdingBomb.worldPosition = this.bomb.worldPosition;
   
    }

    CreateHammer() {
           if (this._holdingBomb||this._holdingHammer||this._holdingSmoke)
               return;
        this._holdingHammer = instantiate(this.hammer);
         this._holdingHammer.active = true;
           this._holdingHammer.parent = this.node;
        this._holdingHammer.worldPosition = this.hammer.worldPosition;
   
    }
    
     CreateSmoke() {
           if (this._holdingBomb||this._holdingHammer||this._holdingSmoke)
               return;
         this._holdingSmoke = instantiate(this.smokebomb);
          this._holdingSmoke.active = true;
            this._holdingSmoke.parent = this.node;
        this._holdingSmoke.worldPosition = this.smokebomb.worldPosition;
    }
    start () {
        // [3]
    }
    retryLevel(){
        this._playerTurn=true;
        this.readData();
    }
    TurnComplete(){
        this._playerTurn=!this._playerTurn;
        if(this._playerTurn){
            this.turnText.string="Player Turn";
            this.skipbutton.active=true;
        }else{
            this.skipbutton.active=false;
            this.playEnemyMove();
        }
    }
    playEnemyMove(){
        this.turnText.string="Enemy Turn";
        let found=false;
        this.scheduleOnce(()=>{
        for(let i=0;i<this.spiders.length;i++){
            if(this.spiders[i]._connectedConnector.hasAValidNeighbor(this.bettles[i])){
                if(!this.spiders[i]._connectedConnector){
                    this.gameOverScreen.active=true;
                    this.gameOverScreen.setSiblingIndex(this.gameOverScreen.parent.children.length+1);
          
                }else{
                let chosenNeighbor=this.spiders[i]._connectedConnector.hasAValidNeighbor(this.bettles[i]);
           
                 
                this.spiders[i]._connectedConnector._placedItem=null;
                if( this.spiders[i]._connectedConnector._connecterType==2){
                    let index=this.connectors.indexOf(this.spiders[i]._connectedConnector);
                    this.connectors.splice(index,1);
                    this.spiders[i]._connectedConnector.node.destroy();
                }
                this.spiders[i]._connectedConnector=chosenNeighbor;
                if( this.spiders[i]._connectedConnector._placedItem&&this.spiders[i]._connectedConnector._placedItem._type=="bettle"){
                    this.gameOverScreen.active=true;
                    this.gameOverScreen.setSiblingIndex(this.gameOverScreen.parent.children.length+1);
                    
                }
                chosenNeighbor._placedItem= this.spiders[i];
                this.spiders[i].node.parent=chosenNeighbor.node;
                this.spiders[i].node.position=new Vec3(0,0,0);
                found=true;
                
                break; 
            }
            }
        }
        if(!found){
            this.gameWinScreen.active=true;
            this.gameWinScreen.setSiblingIndex(this.gameWinScreen.parent.children.length+1);
            return;
        }
       
            this.TurnComplete();
        },1);
    }
    createSpider(data=null){
      
        this._spider = instantiate(this.spider);
        this._spider.parent = this.node.parent;
        this._spider.getComponent(GameElement).init("spider", this,this.spiders.length);
        this._spider.active = true;
              this.spiders.push(this._spider.getComponent(GameElement));
        if (data)
            this._spider.getComponent(GameElement).setData(data);
       
        return this._spider.getComponent(GameElement);
    }
    
    createBettle(data=null){
        
        this._bettle = instantiate(this.bettle);
        this._bettle.parent = this.node.parent;
        this._bettle.getComponent(GameElement).init("bettle", this, this.bettles.length);
          this.bettles.push(this._bettle.getComponent(GameElement));
        this._bettle.active = true;
         if (data)
            this._bettle.getComponent(GameElement).setData(data);
      
        return this._bettle.getComponent(GameElement);
    }
    
    createPortal(event,data=null){
        this._portal = instantiate(this.portal);
        this._portal.parent = this.node.parent;
        this._portal.getComponent(GameElement).init("portal", this, this.portals.length);
         this.portals.push(this._portal.getComponent(GameElement));
          this._portal.active = true;
          if (data)
            this._portal.getComponent(GameElement).setData(data);
        return this._portal.getComponent(GameElement);
          
    }

    createConnector(type,data=null){
       
        this._connector = instantiate(this.connector);
        this._connector.parent = this.node.parent;
           this._connector.getComponent(GameElement).init("connector", this, this.connectors.length,type);
         this.connectors.push(this._connector.getComponent(GameElement));
        this._connector.active = true;
        if (data)
            this._connector.getComponent(GameElement).setData(data);
        return this._connector.getComponent(GameElement);
          
    }

    
    createButton(event,data=null){
        this._button = instantiate(this.button);
        this._button.parent = this.node.parent;
        this._button.getComponent(GameElement).init("button", this,this.buttons.length);
        this._button.active = true;
              this.buttons.push(this._button.getComponent(GameElement ));
        if (data)
            this._button.getComponent(GameElement).setData(data);
       
        return this._button.getComponent(GameElement);
    }
    
    resetLevel() {
        this.gameOverScreen.active=false;
        this.gameWinScreen.active=false;
        this.spiders.forEach(GameElement => {
            GameElement.node.destroy();
        });
        this.spiders = [];
        this.bettles.forEach(GameElement => {
            GameElement.node.destroy();
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
        this.connectors.forEach(GameElement => {
            GameElement.node.destroy();
        });
        this.connectors = [];
    }
  
    SelectBlock(block){
        if(!this._playerTurn)
            return;
          if(!block||!block.node)
            return;
       
        if (block._connecterType == 1) {
            if (this._holdingBomb&&!block._placedItem) {
                let pos = this.node._uiProps.uiTransformComp.convertToNodeSpaceAR(block.node.worldPosition);
                this._holdingBomb.setSiblingIndex(this._holdingBomb.parent.children.length + 1);
                tween(this._holdingBomb).to(0.1, { position: pos, scale: new Vec3(1.5, 1.5, 1.5) }).delay(0.1).
                    call(() => {
                        let index=this.connectors.indexOf(block);
                        this.connectors.splice(index,1);
                        block.node.destroy();
                        this._holdingBomb.destroy();
                        this._holdingBomb = null;
                    })
                    .start();
              
                return;
            }
        }

        let found=false;
        for(let i=0;i<this.bettles.length;i++){
            if(this.bettles[i]._connectedConnector.isANeighbor(block)){
                found=true;
                this.bettles[i].node.parent=block.node;
                this.bettles[i].node.position=new Vec3(0,0,0);
                this.bettles[i]._connectedConnector._placedItem=null;
                if (this.bettles[i]._connectedConnector._connecterType == 2) {
                    
                    let index=this.connectors.indexOf(this.bettles[i]._connectedConnector);
                    this.connectors.splice(index,1);
                    this.bettles[i]._connectedConnector.node.destroy();
                }
                this.bettles[i]._connectedConnector=block;
                this.bettles[i]._connectedConnector._placedItem=this.bettles[i];
                if(this.bettles[i]._connectedConnector._holdingButton){
                    this.bettles[i]._connectedConnector._holdingButton._buttonConnector.node.active=true;
                    this.bettles[i]._connectedConnector._holdingButton._buttonConnector._hidden=false;
                }

                if(this.bettles[i]._connectedConnector._holdingCoin){
                    this.bettles[i]._connectedConnector._holdingCoin.node.active = true;
                       this.collectedCoins++;
                    this.coinText.string = this.collectedCoins +"/"+ this.coins.length;
                    this.bettles[i]._connectedConnector._holdingCoin.node.active = false;
                }

                if(this.bettles[i]._connectedConnector._holdingCookie){
                    this.bettles[i]._connectedConnector._holdingCookie.node.active = true;
                         this.collectedCookies++;
                    this.cookieText.string = this.collectedCookies +"/"+ this.cookies.length;
                    this.bettles[i]._connectedConnector._holdingCookie.node.active = false;
                     }
               
                if( this.bettles[i]._connectedConnector._connecterType==3){
                    this.gameWinScreen.active=true;
                    this.gameWinScreen.setSiblingIndex(this.gameWinScreen.parent.children.length+1);
   
                    return;
                }
             
                break;
            }
        }
      
        if(found)
        this.TurnComplete();
    
        console.log("SelectBlock"+ block._connecterType);
    }
    Play(){
          
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
      this.readData(content);
    }

}
input.click();
    }

 
   
 

    createCookie(event,data=null){
        this._cookie = instantiate(this.cookie);
        this._cookie.parent = this.node.parent;
        this._cookie.getComponent(GameElement).init("cookie", this, this.cookies.length);
         this.cookies.push(this._cookie.getComponent(GameElement));
          this._cookie.active = true;
          if (data)
            this._cookie.getComponent(GameElement).setData(data);
        return this._cookie.getComponent(GameElement);
          
    }
    
    createCoin(event,data=null){
        this._coin = instantiate(this.coin);
        this._coin.parent = this.node.parent;
        this._coin.getComponent(GameElement).init("coin", this, this.coins.length);
         this.coins.push(this._coin.getComponent(GameElement));
          this._coin.active = true;
          if (data)
            this._coin.getComponent(GameElement).setData(data);
        return this._coin.getComponent(GameElement);
          
    }
readData(con=null){
    if(con)
    this._content=con;
let content=this._content;
    console.log(content);
    this.resetLevel();
     let connectors = content["connectors"];
    this.connectors = [];
    connectors.forEach(GameElement => {
            if(GameElement)
            this.createConnector(GameElement.type,GameElement)
        });
    let spiders = content["spiders"];
    this.spiders = [];
    spiders.forEach(GameElement => {
        if (GameElement)
            this.createSpider(GameElement);
        });
        let buttons = content["buttons"];
        if(buttons)
        {
            this.buttons = [];
        buttons.forEach(element => {
            if (element)
                this.createButton(null,element);
            });
        }
    let bettles =  content["bettles"];
    this.bettles = [];
    bettles.forEach(GameElement => {
        if (GameElement)
            this.createBettle(GameElement);
    });
    let coins = content["coins"];
    if (coins) {
        this.coins = [];
        coins.forEach(GameElement => {
            if (GameElement)
                this.createCoin(GameElement);
        });
    }

    let cookies = content["cookies"];
        if (cookies) {
        this.cookies = [];
        cookies.forEach(GameElement => {
            if (GameElement)
                this.createCookie(GameElement);
        });
    }
    let portals = content["portals"];
        if(portals)
        {
            this.portals = [];
            portals.forEach(element => {
            if (element)
                this.createPortal(null,element);
            });
        }
    this.spiders.forEach(GameElement => {
        GameElement.setUpData();
    });
    this.buttons.forEach(element => {
        element.setUpData();
    });
      this.bettles.forEach(GameElement => {
        GameElement.setUpData();
      });
      this.connectors.forEach(GameElement => {
        GameElement.setUpData();
      });
      this.portals.forEach(GameElement => {
        GameElement.setUpData();
      });
      this.coins.forEach(GameElement => {
        GameElement.setUpData();
      });
      this.cookies.forEach(GameElement => {
        GameElement.setUpData();
      });
      this.connectors.forEach(GameElement => {
         GameElement.initializeNeighbours();
       });
   // this._movingconnector = null;
    this._spider = null;
    this._bettle = null;
    this._connector = null;
    this._button = null;
    this._coin = null;
    this._cookie = null;
    this._portal = null;
    this.collectedCoins=0;
    this.collectedCookies=0;
    this.coinText.string=this.collectedCoins+"/"+this.coins.length;
    this.cookieText.string=this.collectedCookies+"/"+this.coins.length;
    this.skipbutton.active = true;
    
     console.log("level" + this.bettles+","+this.connectors+","+ this.spiders);

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
