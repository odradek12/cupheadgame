// import Phaser from 'phaser';
// import Phaser from 'https://cdn.skypack.dev/phaser';
// import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js';

import {
    Level
} from './Level.js';

import {
    Player
} from './Player.js';

import {
    Enemy
} from './Enemy.js';

import {
    Coin
} from './Coin.js';

import {
    Bullet
} from './Bullet.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.lastFired = 0;
    }

    preload() {
        let graphics = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });
        Enemy.createGraphics(this);
        Coin.preload(this);
        Bullet.preload(this);

        this.level = new Level(this);
        this.level.preload();

        graphics.fillStyle(0xADD8E6, 1);
        graphics.fillRect(44, 0, 4, 200);
        graphics.fillRect(10, 99, 120, 2);
        graphics.fillRect(20, 30, 50, 2);
        graphics.fillRect(25, 20, 40, 2);
        graphics.fillRect(30, 10, 30, 2);
        graphics.generateTexture('treeTexture', 80, 200);
        graphics.clear();
    }

    create() {
        //Setting camera & world bounds
        let levelWidth = 2400;

        this.cameras.main.setBackgroundColor(0x000000);
        this.cameras.main.setBounds(0, 0, levelWidth, 600);
        this.physics.world.setBounds(0, 0, levelWidth, 600);

        this.level.create();

        //The player
        this.player = new Player(this, 400, 300, 10, 10, 0xFFFFE0);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(200, 600);

        this.enemies = this.add.group({
            classType: Enemy,
            // runChildUpdate: true // This will automatically call update on each enemy
        });

        // Adding enemies to the group
        for (let i = 0; i < 3; i++) {
            this.enemies.add(new Enemy(this, 100 + (50 * i), 450));
        }
        this.level.setupCollisions([this.player, this.enemies]);

        this.time.addEvent({
            delay: 1000,
            callback: this.updateEnemies,
            callbackScope: this,
            loop: true
        });

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(275, 400, 'platformTexture');
        this.platforms.create(425, 400, 'platformTexture');
        this.physics.add.collider(this.player, this.platforms);

        // Add trees to background

        this.trees = this.add.group();

        for (let j = 0; j < 4; j++) {
            let xPosition = j * 150;
            let tree = this.add.sprite(xPosition, this.cameras.main.centerY + 150, 'treeTexture');
            let treeScale = Phaser.Math.Between(70, 100) / 100;
            tree.setScale(treeScale);

            let treeHeight = Phaser.Math.Between(0, 40);
            tree.y -= treeHeight;

            tree.setDepth(-1);
            tree.setOrigin(0.5, 0.5);
            tree.setScrollFactor(0.5);

            this.trees.add(tree);
        }

        const coinPositions = [{
            x: 300,
            y: 300
        }, {
            x: 350,
            y: 300
        }, {
            x: 400,
            y: 300
        }, {
            x: 800,
            y: 400
        }, {
            x: 850,
            y: 400
        }, {
            x: 900,
            y: 400
        }];
        this.coins = Coin.createCoins(this, coinPositions);
        this.physics.add.overlap(this.player, this.coins, Coin.collectItem, null, this);

        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.bullets = this.add.group({
            classType: Bullet,
            runChildUpdate: true
        });

        this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            enemy.destroy();
        });
    }

    update() {
        if (this.shootKey.isDown) {
            const bullet = Bullet.fireBullet(this, this.player.x, this.player.y, this.player.facing);
            if (bullet) {
                this.bullets.add(bullet);
            }
        }
        this.player.update();
    }

    updateEnemies() {
        this.enemies.getChildren().forEach(enemy => {
            enemy.changeDirection(this.player);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 400
            },
            debug: false
        }
    },
    scene: GameScene
};

const game = new Phaser.Game(config);