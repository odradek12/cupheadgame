// import Phaser from 'phaser';
// import Phaser from 'https://cdn.skypack.dev/phaser';
// import Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload(){
        let graphics = this.make.graphics({ x: 0, y: 0, add: false});

        graphics.fillStyle(0xFF0000, 1);
        graphics.fillRect(0,0,20,4);
        graphics.generateTexture('bulletTexture', 20, 4);
        graphics.clear();

        graphics.fillStyle(0xADD8E6, 1);
        graphics.beginPath();
        graphics.moveTo(7.5,0);
        graphics.lineTo(15,15);
        graphics.lineTo(0,15);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('enemyTexture', 15, 15);
        graphics.clear();

        graphics.fillStyle(0x008800, 1);
        graphics.fillRect(0, 0, 50, 10);
        graphics.generateTexture('platformTexture', 50, 10);
        graphics.clear();

        graphics.fillStyle(0xADD8E6, 1);
        graphics.fillRect(0, 0, 2, 200);
        graphics.generateTexture('treeTexture', 2, 200);
        graphics.clear();
    }

    create(){
        //Setting camera & world bounds

        this.cameras.main.setBackgroundColor(0x000000);
        this.physics.world.setBounds(0, 0, 1600, 600);

        //The ground

        this.ground = this.add.rectangle(400, 550, 2400, 100, 0x00FF00);
        this.physics.add.existing(this.ground);
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        //The player

        this.player = this.add.rectangle(400, 300, 10, 10, 0xFFFFE0);
        this.physics.add.existing(this.player);
        this.cameras.main.setDeadzone(400 - 200, 600);

        this.player.body.collideWorldBounds = true;
        this.player.body.setCollideWorldBounds(true);

        this.player.facing = 'right';

        this.cameras.main.startFollow(this.player);

        this.playerSpeed = 250;
        this.bulletSpeed = 1500;

        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.physics.add.collider(this.player, this.ground);

        this.bullets = this.physics.add.group();

        // The enemies

        this.enemies = this.physics.add.group();
        this.physics.add.collider(this.enemies, this.ground);

        for (let i = 0; i < 3; i++){
            let enemy = this.enemies.create(200 - i * 40, 480, 'enemyTexture');
            enemy.setCollideWorldBounds(true);
            enemy.body.allowGravity = true;
        }

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(275, 400, 'platformTexture');
        this.platforms.create(425, 400, 'platformTexture');
        this.physics.add.collider(this.player, this.platforms);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.enemies.getChildren().forEach(enemy => {
                    if (this.player.x > enemy.x) {
                        enemy.setVelocityX(100);
                    } else if (this.player.x < enemy.x){
                        enemy.setVelocityX(-100);
                    }
                })
            },
            loop:true
        });


        // Add trees to background 

        // const treeNumber = 5;
        // this.trees = this.add.group();

        // for (let i = 0; i < treeNumber; i++){
        //     let tree = this.add.tileSprite(100 + (i * 50), this.cameras.main.centerY + 100, 2, 200, 'treeTexture');
        //     // tree.setOrigin(0.5, 0.5);
        //     this.trees.add(tree);
        // }

        this.trees = this.add.tileSprite(0, this.cameras.main.centerY, this.cameras.main.width * 2, 10, 'treeTexture');
        // this.trees.setOrigin(0, 0.5);
    }

    update() {
        if (this.upKey.isDown && this.player.body.touching.down) {
            this.player.body.setVelocity(-300);
        }


        if (this.leftKey.isDown){
            this.player.body.setVelocityX(-this.playerSpeed);
            this.player.facing = 'left';
        } else if (this.rightKey.isDown){
            this.player.body.setVelocityX(this.playerSpeed);
            this.player.facing = 'right';
        } 
        else {
            this.player.body.setVelocityX(0);
        }



        if (this.shootKey.isDown && !this.isShooting) {
            this.isShooting = true;
            this.shootBullet();
            this.time.delayedCall(250, () => {
                this.isShooting = false;
            })
        }

        this.physics.collide(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            enemy.destroy();
        })

        // const cameraSpeed = 0.5;

        // const parallaxSpeed = cameraSpeed * 0.5;

        // this.trees.getChildren().forEach(tree => {
        //     tree.x -= parallaxSpeed;
        // });

        this.trees.tilePositionX = this.cameras.main.scrollX * 0.5;
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
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: GameScene
};

const game = new Phaser.Game(config);