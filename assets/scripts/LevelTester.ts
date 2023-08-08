
import {instantiate, _decorator, Component, Node, Label } from 'cc';
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
    @property({ type: Node })
    spider: Node = null;
      @property({ type: Node })
      bettle: Node = null;
      @property({ type: Node })
      connector: Node = null;
      @property({ type: Node })
      skipbutton: Node = null;
      @property({ type: Label })
      turnText: Label = null;
      _connector=null
      _spider=null;
      _bettle=null;
      _playerTurn=true;

    start () {
        // [3]
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
        this.scheduleOnce(()=>{
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
    resetLevel() {
        this.spiders.forEach(GameElement => {
            GameElement.node.destroy();
        });
        this.spiders = [];
        this.bettles.forEach(GameElement => {
            GameElement.node.destroy();
        });
          this.bettles = [];
        this.connectors.forEach(GameElement => {
            GameElement.node.destroy();
        });
        this.connectors = [];
    }
  
    SelectBlock(block){
        if(!this._playerTurn)
            return;
        if( block._connecterType==1)
       {block.node.destroy();
      
        this.TurnComplete();}
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
      
       let bettles =  content["bettles"];
       this.bettles = [];
       bettles.forEach(GameElement => {
           if (GameElement)
               this.createBettle(GameElement);
       });
       this.spiders.forEach(GameElement => {
           GameElement.setUpData();
       });
         this.bettles.forEach(GameElement => {
           GameElement.setUpData();
         });
         this.connectors.forEach(GameElement => {
           GameElement.setUpData();
         });
      // this._movingconnector = null;
       this._spider = null;
       this._bettle = null;
       this._connector = null;
      
       
        console.log("level" + this.bettles+","+this.connectors+","+ this.spiders);
    }

}
input.click();
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
