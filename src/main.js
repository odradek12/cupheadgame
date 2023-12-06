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

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        let graphics = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });
        Enemy.preload(this);
        this.level = new Level(this);
        this.level.preload();

        graphics.fillStyle(0xFF0000, 1);
        graphics.fillRect(0, 0, 20, 4);
        graphics.generateTexture('bulletTexture', 20, 4);
        graphics.clear();

        graphics.fillStyle(0xADD8E6, 1);
        graphics.fillRect(44, 0, 4, 200);
        graphics.fillRect(10, 99, 120, 2);
        graphics.fillRect(20, 30, 50, 2);
        graphics.fillRect(25, 20, 40, 2);
        graphics.fillRect(30, 10, 30, 2);
        graphics.generateTexture('treeTexture', 80, 200);
        graphics.clear();

        // coins
        graphics.lineStyle(3, 0xFFFF00, 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(10, 10);
        graphics.moveTo(10, 0);
        graphics.lineTo(0, 10);
        graphics.closePath();
        graphics.strokePath();
        graphics.generateTexture('coinTexture', 10, 10);
    }

    create() {
        //Setting camera & world bounds
        let levelWidth = 2400;
        let initialGroundWidth = (2 / 3) * levelWidth;
        let elevatedGroundWidth = levelWidth - initialGroundWidth;

        this.cameras.main.setBackgroundColor(0x000000);
        this.cameras.main.setBounds(0, 0, levelWidth, 600);
        this.physics.world.setBounds(0, 0, levelWidth, 600);

        this.level.create();

        //The player
        this.player = new Player(this, 400, 300, 10, 10, 0xFFFFE0);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(200, 600);



        this.bulletSpeed = 1500;
        // this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.bullets = this.physics.add.group();

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

        // this.physics.add.collider(this.enemies, [ground1, ground2])

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(275, 400, 'platformTexture');
        this.platforms.create(425, 400, 'platformTexture');
        this.physics.add.collider(this.player, this.platforms);

        // Add trees to background

        this.trees = this.add.group();

        for (let j = 0; j < 4; j++) {
            let xPosition = j * 150;
            // let tree = this.add.image(xPosition, this.cameras.main.centerY + 100, 'treeTexture');
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

        // coins

        this.coins = this.physics.add.staticGroup();

        this.coins.create(300, 300, 'coinTexture');
        this.coins.create(350, 300, 'coinTexture');
        this.coins.create(400, 300, 'coinTexture');

        this.coins.create(800, 400, 'coinTexture');
        this.coins.create(850, 400, 'coinTexture');
        this.coins.create(900, 400, 'coinTexture');

        this.physics.add.overlap(this.player, this.coins, this.collectItem, null, this)

        // end create
    }

    update() {

        this.physics.collide(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            enemy.destroy();
        })

        this.player.update();
    }

    shootBullet() {
        let bullet = this.bullets.create(this.player.x, this.player.y, 'bulletTexture');

        if (this.player.facing == 'right') {
            bullet.setVelocityX(this.bulletSpeed);
        } else if (this.player.facing == 'left') {
            bullet.setVelocityX(-this.bulletSpeed);
        }

        bullet.setCollideWorldBounds(false);
        bullet.outOfBoundsKill = true;
        bullet.body.allowGravity = false;
    }

    collectItem(player, coin) {
        coin.destroy();
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