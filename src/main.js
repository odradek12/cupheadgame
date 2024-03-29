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

import {
    Health
} from './Health.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.lastFired = 0;
        this.platformCollision = null;

        this.enemySpawnY = 450;
        this.enemySpawnPoints = [{
                x: 2000,
                y: this.enemySpawnY,
                spawned: false
            }, {
                x: 2050,
                y: this.enemySpawnY,
                spawned: false
            },
            // ... more spawn points ...
        ];
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
        let levelWidth = 3600;

        this.cameras.main.setBackgroundColor(0x5b6f8f);
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
            this.enemies.add(new Enemy(this, 100 + (50 * i), this.enemySpawnY));
            // this.spawnEnemy(spawnPoint.x, spawnPoint.y);
        }

        this.level.setupCollisions([this.player, this.enemies]);
        this.platformCollision = this.level.setupPlatformCollisions(this.player);

        this.time.addEvent({
            delay: 1000,
            callback: this.updateEnemies,
            callbackScope: this,
            loop: true
        });



        // Add trees to background

        this.trees = this.add.group();

        for (let j = 0; j < 8; j++) {
            let treeConstant = 175
            let xPosition = j * treeConstant;
            let randomXPosition = Phaser.Math.Between(xPosition, ((j + 1) * treeConstant));
            let tree = this.add.sprite(randomXPosition, this.cameras.main.centerY + 150, 'treeTexture');
            let treeScale = Phaser.Math.Between(64, 100) / 100;
            tree.setScale(treeScale);

            let treeHeight = Phaser.Math.Between(-10, 20);
            tree.y -= treeHeight;

            tree.setDepth(-1);
            tree.setOrigin(0.5, 0.5);
            tree.setScrollFactor(0.5);

            this.trees.add(tree);
        }

        this.health = new Health(this, 3);

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

        // collisions & inputs

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

        // this.physics.add.overlap(this.player, this.enemies, () => {
        //     console.log("good grief");
        // }, null, this);

        this.physics.add.overlap(this.player, this.enemies, Health.registerHit, null, this);

    }

    update() {
        if (this.shootKey.isDown) {
            const bullet = Bullet.fireBullet(this, this.player.x, this.player.y, this.player.facing);
            if (bullet) {
                this.bullets.add(bullet);
            }
        }
        this.player.update();

        if (this.player.body.velocity.y < 0) {
            this.platformCollision.active = false;
        } else {
            this.platformCollision.active = true;
        }

        this.checkEnemySpawns()
    }
    checkEnemySpawns() {

        const spawnDistance = 600; // Distance within which enemies will spawn

        this.enemySpawnPoints.forEach(spawnPoint => {
            if (!spawnPoint.spawned && Phaser.Math.Distance.Between(this.player.x, this.player.y, spawnPoint.x, spawnPoint.y) < spawnDistance) {
                // Spawn the enemy
                this.spawnEnemy(spawnPoint.x, spawnPoint.y);
                spawnPoint.spawned = true;
            }
        });
    }
    spawnEnemy(x, y) {
        const enemy = new Enemy(this, x, y);
        this.enemies.add(enemy);
        // Additional setup for the enemy if needed
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