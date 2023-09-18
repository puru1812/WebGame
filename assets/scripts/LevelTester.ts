
import { instantiate, _decorator, Component, Node, Label, Tween, tween, Vec3, Sprite, SpriteFrame } from 'cc';
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
    treasures = [];
    @property({ type: Node })
    coin: Node = null;
    @property({ type: Node })
    cookie: Node = null;
    @property({ type: Node })
    treasure: Node = null;
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
    @property({ type: SpriteFrame })
    treasureFrame: SpriteFrame = null;
    @property({ type: Node })
    smokebomb: Node = null;
    @property({ type: Label })
    coinText: Label = null;
    @property({ type: Label })
    cookieText: Label = null;
    @property({ type: Label })
    friendsText: Label = null;
    _button = null;
    _content = null;
    _connector = null
    _spider = null;
    _portal = null;
    _cookie = null;
    _treasure = null;
    _coin = null;
    _bettle = null;
    _playerTurn = true;
    collectedCoins = 0;
    collectedCookies = 0;
    _holdingBomb = null;
    _holdingHammer = null;
    _holdingSmoke = null;
    _playerTurnBettles = [];
    exitPoints = [];

    CreateBomb() {
        if (this._holdingBomb)
            return;
        this._holdingBomb = instantiate(this.bomb);
        this._holdingBomb.active = true;
        this._holdingBomb.parent = this.node;
        this._holdingBomb.worldPosition = this.bomb.worldPosition;
        return this._holdingBomb;
    }

    CreateHammer() {
        if (this._holdingHammer)
            return;
        this._holdingHammer = instantiate(this.hammer);
        this._holdingHammer.active = true;
        this._holdingHammer.parent = this.node;
        this._holdingHammer.worldPosition = this.hammer.worldPosition;
        return this._holdingHammer;
    }

    CreateSmoke() {
        if (this._holdingSmoke)
            return;
        this._holdingSmoke = instantiate(this.smokebomb);
        this._holdingSmoke.active = true;
        this._holdingSmoke.parent = this.node;
        this._holdingSmoke.worldPosition = this.smokebomb.worldPosition;
        return this._holdingSmoke;
    }
    start() {
        // [3]
    }
    retryLevel() {
        this._playerTurn = true;
        this.readData();
    }
    TurnComplete() {
        this._playerTurn = !this._playerTurn;
        let bettles = [];
        this._playerTurnBettles = [];
        for (let i = 0; i < this.bettles.length; i++) {
            if (!this.bettles[i]._trapped) {
                bettles.push(this.bettles[i]);
                this._playerTurnBettles.push(this.bettles[i]);
            }
        }
        if (bettles.length <= 0) {
            this.gameOverScreen.active = true;
            this.gameOverScreen.setSiblingIndex(this.gameOverScreen.parent.children.length + 1);
            return;
        }
        if (this._playerTurn) {

            this.turnText.string = "Player Turn";
            this.skipbutton.active = true;
        } else {
            this.skipbutton.active = false;
            this.playEnemyMove(bettles);
        }
    }
    playEnemyMove(bettles) {
        this.turnText.string = "Enemy Turn";
        let found = false;
        let spiders = [];
        for (let i = 0; i < this.spiders.length; i++) {
            if (!this.spiders[i]._trapped&&!this.spiders[i]._connectedConnector._hidden)
                spiders.push(this.spiders[i]);
        }
        let k = 0;
        let chosenNeighbors = [];
        this.scheduleOnce(() => {
            for (let i = 0; i < spiders.length; i++) {
                if (!spiders[i]._trapped && !spiders[i]._sleeping && spiders[i]._connectedConnector.hasAValidNeighbor(this.bettles[k],  chosenNeighbors)) {
                    if (!spiders[i]._connectedConnector) {
                        this.gameOverScreen.active = true;
                        this.gameOverScreen.setSiblingIndex(this.gameOverScreen.parent.children.length + 1);

                    } else {
                        let chosenNeighbor = spiders[i]._connectedConnector.hasAValidNeighbor(this.bettles[k],chosenNeighbors);
                        chosenNeighbors.push(chosenNeighbor);
                        if (chosenNeighbor.hasTrappedPlacedItem("spider")) {
                            chosenNeighbor.hasTrappedPlacedItem("spider").setTrapped(false);


                        }

                        spiders[i]._connectedConnector.removePlacedItem(spiders[i]);
                        if (spiders[i]._connectedConnector._connecterType == 2) {
                            let index = this.connectors.indexOf(spiders[i]._connectedConnector);
                            this.connectors.splice(index, 1);
                            spiders[i]._connectedConnector.node.destroy();
                        }
                      

                        spiders[i]._connectedConnector = chosenNeighbor;
                        if (spiders[i]._connectedConnector.hasUnTrappedPlacedItem("bettle")) {
                            spiders[i]._connectedConnector.hasUnTrappedPlacedItem("bettle").setTrapped(true);

                        }
                        if (spiders[i]._connectedConnector._holdingButton) {
                            spiders[i]._connectedConnector._holdingButton._buttonConnector.node.active = true;
                            spiders[i]._connectedConnector._holdingButton._buttonConnector._hidden = false;
                        }
                        if (chosenNeighbor._holdingButton) {
                            chosenNeighbor._holdingButton._buttonConnector.node.active = true;
                            chosenNeighbor._holdingButton._buttonConnector._hidden = false;
                        }
                        chosenNeighbor.addPlacedItem(spiders[i]);
                        spiders[i].node.parent = chosenNeighbor.node;
                        spiders[i].node.position = new Vec3(0, 0, 0);
                        found = true;
                        if(bettles.length>k+1)
                        k++;

                    }
                } else if (spiders[i]._sleeping) {
                    spiders[i]._sleeping = false;
                    spiders[i].node.children[0].active = false;
                }
            }


            this.TurnComplete();
        }, 1);
    }
    createSpider(data = null) {

        this._spider = instantiate(this.spider);
        this._spider.parent = this.node.parent;
        this._spider.getComponent(GameElement).init("spider", this, this.spiders.length);
        this._spider.active = true;
        this.spiders.push(this._spider.getComponent(GameElement));
        if (data)
            this._spider.getComponent(GameElement).setData(data);

        return this._spider.getComponent(GameElement);
    }

    createBettle(data = null) {

        this._bettle = instantiate(this.bettle);
        this._bettle.parent = this.node.parent;
        this._bettle.getComponent(GameElement).init("bettle", this, this.bettles.length);
        this.bettles.push(this._bettle.getComponent(GameElement));
        this._bettle.active = true;
        if (data)
            this._bettle.getComponent(GameElement).setData(data);

        return this._bettle.getComponent(GameElement);
    }

    createPortal(event, data = null) {
        this._portal = instantiate(this.portal);
        this._portal.parent = this.node.parent;
        this._portal.getComponent(GameElement).init("portal", this, this.portals.length);
        this.portals.push(this._portal.getComponent(GameElement));
        this._portal.active = true;
        if (data)
            this._portal.getComponent(GameElement).setData(data);
        return this._portal.getComponent(GameElement);

    }

    createConnector(type, data = null) {

        this._connector = instantiate(this.connector);
        this._connector.parent = this.node.parent;
        this._connector.getComponent(GameElement).init("connector", this, data.id, type);
        this.connectors.push(this._connector.getComponent(GameElement));
        this._connector.active = true;
        if (data)
            this._connector.getComponent(GameElement).setData(data);
         this._connector.getComponent(GameElement).initializeNeighbours();
        return this._connector.getComponent(GameElement);

    }


    createButton(event, data = null) {
        this._button = instantiate(this.button);
        this._button.parent = this.node.parent;
        this._button.getComponent(GameElement).init("button", this, this.buttons.length);
        this._button.active = true;
        this.buttons.push(this._button.getComponent(GameElement));
        if (data)
            this._button.getComponent(GameElement).setData(data);
     

        return this._button.getComponent(GameElement);
    }

    resetLevel() {
        this.gameOverScreen.active = false;
        this.gameWinScreen.active = false;
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
        this.treasures.forEach(GameElement => {
            GameElement.node.destroy();
        });
        this.treasures = [];
    }


    SelectBlock(block) {
        if (!this._playerTurn)
            return;
        if (!block || !block.node)
            return;
        if (block.hasTrappedPlacedItem("bettle")) {
            block.hasTrappedPlacedItem("bettle").setTrapped(false);


        }
        if (block.hasPlacedItem("spider")) {
            if (this._holdingSmoke) {
                let pos = this.node._uiProps.uiTransformComp.convertToNodeSpaceAR(block.node.worldPosition);
                this._holdingSmoke.setSiblingIndex(this._holdingSmoke.parent.children.length + 1);
                tween(this._holdingSmoke).to(0.1, { position: pos, scale: new Vec3(1.5, 1.5, 1.5) }).delay(0.1).
                    call(() => {
                        block.hasPlacedItem("spider")._sleeping = true;
                        block.hasPlacedItem("spider").node.children[0].active = true;
                        this._holdingSmoke.destroy();
                        this._holdingSmoke = null;
                    })
                    .start();

                return;
            } else {
                if (block.hasPlacedItem("spider")._trapped != true) {
                    this.gameOverScreen.active = true;
                    this.gameOverScreen.setSiblingIndex(this.gameOverScreen.parent.children.length + 1);
                    return;
                }


            }
        }
        if (block._connecterType == 1) {
            if (this._holdingBomb && !block.hasPlacedItem("spider")) {
                let pos = this.node._uiProps.uiTransformComp.convertToNodeSpaceAR(block.node.worldPosition);
                this._holdingBomb.setSiblingIndex(this._holdingBomb.parent.children.length + 1);
                tween(this._holdingBomb).to(0.1, { position: pos, scale: new Vec3(1.5, 1.5, 1.5) }).delay(0.1).
                    call(() => {
                        let index = this.connectors.indexOf(block);
                        this.connectors.splice(index, 1);
                        block.node.destroy();
                        this._holdingBomb.destroy();
                        this._holdingBomb = null;
                    })
                    .start();

                return;
            }
        }
        if (block._connecterType == 5) {
            if (this._holdingHammer && !block.hasPlacedItem("spider")) {
                let pos = this.node._uiProps.uiTransformComp.convertToNodeSpaceAR(block.node.worldPosition);
                this._holdingHammer.setSiblingIndex(this._holdingHammer.parent.children.length + 1);
                tween(this._holdingHammer).to(0.1, { position: pos, scale: new Vec3(1.5, 1.5, 1.5) }).delay(0.1).
                    call(() => {
                        block._connecterType = 4;
                        block.face.spriteFrame = block.frames[block._connecterType - 1];

                        this._holdingHammer.destroy();
                        this._holdingHammer = null;
                    })
                    .start();

                return;
            } else {
                return;
            }
        }

        let found = -1;
        for (let i = 0; i < this._playerTurnBettles.length; i++) {
            if (this._playerTurnBettles[i]._connectedConnector.isANeighbor(block)) {


                found = true;
                this._playerTurnBettles[i].node.parent = block.node;
                this._playerTurnBettles[i].node.position = new Vec3(0, 0, 0);
                this._playerTurnBettles[i]._connectedConnector.removePlacedItem(this._playerTurnBettles[i]);
                if (this._playerTurnBettles[i]._connectedConnector._connecterType == 2) {

                    let index = this.connectors.indexOf(this._playerTurnBettles[i]._connectedConnector);
                    this.connectors.splice(index, 1);
                    this._playerTurnBettles[i]._connectedConnector.node.destroy();
                }
                this._playerTurnBettles[i]._connectedConnector = block;
                this._playerTurnBettles[i]._connectedConnector.addPlacedItem(this._playerTurnBettles[i]);
                if (this._playerTurnBettles[i]._connectedConnector._holdingButton) {
                    this._playerTurnBettles[i]._connectedConnector._holdingButton._buttonConnector.node.active = true;
                    this._playerTurnBettles[i]._connectedConnector._holdingButton._buttonConnector._hidden = false;
                }

                if (this._playerTurnBettles[i]._connectedConnector._holdingCoin) {

                    this.collectedCoins++;
                    this.coinText.string = this.collectedCoins + "/" + this.coins.length;
                    this._playerTurnBettles[i]._connectedConnector._holdingCoin.node.active = false;
                    this._playerTurnBettles[i]._connectedConnector._holdingCoin = null;
                }

                if (this._playerTurnBettles[i]._connectedConnector._holdingCookie) {

                    this.collectedCookies++;
                    this.cookieText.string = this.collectedCookies + "/" + this.cookies.length;
                    this._playerTurnBettles[i]._connectedConnector._holdingCookie.node.active = false;
                    this._playerTurnBettles[i]._connectedConnector._holdingCookie = null;
                }

                if (this._playerTurnBettles[i]._connectedConnector._holdingTreasure) {
                    let item = null;
                    let pos = null;
                    if (Math.random() > 0.7) {
                        pos = this.hammer.worldPosition;
                        item = this.CreateHammer();
                    }
                    else if (Math.random() > 0.3) {
                        pos = this.bomb.worldPosition;
                        item = this.CreateBomb();
                    }
                    else {
                        pos = this.smokebomb.worldPosition;
                        item = this.CreateSmoke();
                    }


                    item.active = false;
                    this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node.parent = this._playerTurnBettles[i]._connectedConnector.node.parent;
                    this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node.setSiblingIndex(this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node.parent.children.length);
                    item.setSiblingIndex(this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node.parent.children.length);
                    this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node.worldPosition = this._playerTurnBettles[i]._connectedConnector.node.worldPosition;

                    tween(this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node).to(1, { position: new Vec3(0, 0, 0), scale: new Vec3(8, 8, 8) }).delay(0.1).call(() => {
                        item.active = true;
                        item.parent = this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node.parent;
                        item.worldPosition = this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node.worldPosition;

                        this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node.getComponent(Sprite).spriteFrame = this.treasureFrame;

                    }).delay(1).call(() => {
                        item.worldPosition = pos;
                        ;

                        this._playerTurnBettles[i]._connectedConnector._holdingTreasure.node.active = false;

                        this._playerTurnBettles[i]._connectedConnector._holdingTreasure = null;
                    }).start();
                }

                if (this._playerTurnBettles[i]._connectedConnector._connecterType == 3) {
                    this.gameWinScreen.active = true;
                    this.gameWinScreen.setSiblingIndex(this.gameWinScreen.parent.children.length + 1);

                    return;
                }

                found = i;

                break;
            }
        }
        if (found >= 0)
            this._playerTurnBettles.splice(found, 1);

        if (this._playerTurnBettles.length <= 0)
            this.TurnComplete();

        console.log("SelectBlock" + block._connecterType);
    }
    Play() {

    }
    loadFile() {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => {

            // getting a hold of the file reference
            var file = e.target.files[0];

            // setting up the reader
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');

            // here we tell the reader what to do when it's done reading...
            reader.onload = readerEvent => {
                var content = JSON.parse(readerEvent.target.result); // this is the content!
                this.readData(content);
            }

        }
        input.click();
    }





    createCookie(event, data = null) {
        this._cookie = instantiate(this.cookie);
        this._cookie.parent = this.node.parent;
        this._cookie.getComponent(GameElement).init("cookie", this, this.cookies.length);
        this.cookies.push(this._cookie.getComponent(GameElement));
        this._cookie.active = true;
        if (data)
            this._cookie.getComponent(GameElement).setData(data);
        return this._cookie.getComponent(GameElement);

    }

    createCoin(event, data = null) {
        this._coin = instantiate(this.coin);
        this._coin.parent = this.node.parent;
        this._coin.getComponent(GameElement).init("coin", this, this.coins.length);
        this.coins.push(this._coin.getComponent(GameElement));
        this._coin.active = true;
        if (data)
            this._coin.getComponent(GameElement).setData(data);
        return this._coin.getComponent(GameElement);

    }

    createTreasure(event, data = null) {
        this._treasure = instantiate(this.treasure);
        this._treasure.parent = this.node.parent;
        this._treasure.getComponent(GameElement).init("treasure", this, this.treasures.length);
        this.treasures.push(this._treasure.getComponent(GameElement));
        this._treasure.active = true;
        if (data)
            this._treasure.getComponent(GameElement).setData(data);
        return this._treasure.getComponent(GameElement);

    }
        clear() {
            this.spiders = [];;
              this.bettles = [];;
            this.connectors = [];
             this._spider = null;
        this._bettle = null;
        this._connector = null;
        this._button = null;
        this._coin = null;
        this._cookie = null;
        this._portal = null;
        this._treasure = null;
        this.collectedCoins = 0;
        this.collectedCookies = 0;
        this.coinText.string = this.collectedCoins + "/" + this.coins.length;
        this.cookieText.string = this.collectedCookies + "/" + this.coins.length;
        this.skipbutton.active = true;
            this._playerTurnBettles = [];
            this.treasures = [];
            this.portals = [];
              this.coins = [];
            
        
    }
    readData(con = null) {
        if (con)
            this._content = con;
        let content = this._content;
        console.log(content);
        this.resetLevel();
        let connectors = content["connectors"];
        this.connectors = [];
        connectors.forEach(GameElement => {
            if (GameElement)
                this.createConnector(GameElement.type, GameElement)
        });
        let spiders = content["spiders"];
        this.spiders = [];
        spiders.forEach(GameElement => {
            if (GameElement)
                this.createSpider(GameElement);
        });
        let buttons = content["buttons"];
        if (buttons) {
            this.buttons = [];
            buttons.forEach(element => {
                if (element)
                    this.createButton(null, element);
            });
        }
        let bettles = content["bettles"];
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
        if (portals) {
            this.portals = [];
            portals.forEach(element => {
                if (element)
                    this.createPortal(null, element);
            });
        }
        let treasures = content["treasures"];
        if (treasures) {
            this.treasures = [];
            treasures.forEach(GameElement => {
                if (GameElement)
                    this.createTreasure(GameElement);
            });
        }
        this.treasures.forEach(GameElement => {
            GameElement.setUpData();
        });
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
        for (let i = 0; i < this.connectors.length; i++){
            this.connectors[i].initializeNeighbours();
        }
     
       
        // this._movingconnector = null;
        this._spider = null;
        this._bettle = null;
        this._connector = null;
        this._button = null;
        this._coin = null;
        this._cookie = null;
        this._portal = null;
        this._treasure = null;
        this.collectedCoins = 0;
        this.collectedCookies = 0;
        this.coinText.string = this.collectedCoins + "/" + this.coins.length;
        this.cookieText.string = this.collectedCookies + "/" + this.coins.length;
        this.skipbutton.active = true;
        this._playerTurnBettles = [];
        for (let i = 0; i < this.bettles.length; i++) {
            if (!this.bettles[i]._trapped) {
                this._playerTurnBettles.push(this.bettles[i]);
            }
        }
        console.log("level" + this.bettles + "," + this.connectors + "," + this.spiders);

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
