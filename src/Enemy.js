export class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemyTexture');
        this.scene = scene;

        // Initialize enemy properties
        this.speed = 100;

        // Add the enemy to the scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
    changeDirection(player) {
        // Change the enemy's direction based on the player's position
        if (player.x > this.x) {
            this.body.setVelocityX(this.speed);
        } else if (player.x < this.x) {
            this.body.setVelocityX(-this.speed);
        }
    }

    static preload(scene) {
        let graphics = scene.make.graphics({
            x: 0,
            y: 0,
            add: false
        });

        graphics.fillStyle(0xADD8E6, 1);
        graphics.beginPath();
        graphics.moveTo(7.5, 0);
        graphics.lineTo(15, 15);
        graphics.lineTo(0, 15);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('enemyTexture', 15, 15);
        graphics.clear();
    }

    // update(player) {
    //     // Adjust the enemy's velocity based on the player's position
    //     if (player.x > this.x) {
    //         this.body.setVelocityX(this.speed);
    //     } else if (player.x < this.x) {
    //         this.body.setVelocityX(-this.speed);
    //     }
    // }


}