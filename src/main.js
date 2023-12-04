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

    create(){
        //Setting camera & world bounds
        let levelWidth = 2400;
        let initialGroundWidth = (2/3) * levelWidth;
        let elevatedGroundWidth = levelWidth - initialGroundWidth;

        this.cameras.main.setBackgroundColor(0x000000);
        this.cameras.main.setBounds(0, 0, levelWidth, 600);
        this.physics.world.setBounds(0, 0, levelWidth, 600); 

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

        this.bullets = this.physics.add.group();

       //The ground     

        // this.ground = this.add.rectangle(400, 550, 2400, 100, 0x00FF00);
        // this.physics.add.existing(this.ground);
        // this.ground.body.immovable = true;
        // this.ground.body.allowGravity = false;

        // this.physics.add.collider(this.player, this.ground);

        // Initial flat ground
        const ground1 = this.add.rectangle(0, 550, 2134, 100, 0x00FF00); // 2/3 of 1600 is 1066.67, but we can round it
        this.physics.add.existing(ground1, true); // The 'true' flag makes it static

        // Elevated ground
        const ground2 = this.add.rectangle(1067 + (533 / 2), 500, 533, 200, 0x00FF00); // 533 is the remaining 1/3 of 1600
        this.physics.add.existing(ground2, true);

        this.physics.add.collider(this.player, [ground1, ground2]);

       // const ground1 = this.add.rectangle(0, 550, 1066, 100, 0x00FF00);

        // let ground1 = this.physics.add.staticImage(initialGroundWidth/2, this.cameras.main.height - 50, 'groundTexture');
        // ground1.setDisplaySize(initialGroundWidth, 100);
        // ground1.setImmovable(true);

        // let ground2 = this.physics.add.staticImage(initialGroundWidth + (elevatedGroundWidth/2), this.cameras.main.height - 150, 'groundTexture');
        // ground2.setDisplaySize(initialGroundWidth, 100);
        // ground2.setImmovable(true);

        // this.cameras.main.setBackgroundColor(0x000000);
        // this.physics.world.setBounds(0, 0, 1600, 600);

         // this.physics.add.existing(ground1, true);

        // this.physics.add.collider(this.player, [ground1]);
        // The enemies

        this.enemies = this.physics.add.group();
        // this.physics.add.collider(this.enemies, this.ground);
        this.physics.add.collider(this.enemies, [ground1, ground2]);


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

        this.trees = this.add.group();

        for (let j=0; j<4; j++){
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

        // this.trees.tilePositionX = this.cameras.main.scrollX * 0.5;
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