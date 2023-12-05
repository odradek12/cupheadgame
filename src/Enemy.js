// export class Enemy extends Phaser.GameObjects.Rectangle {
//     constructor(scene, x, y, width, height, color) {
//         super(scene, x, y, width, height, color);
//         this.scene = scene;

//         this.playerSpeed = 250;

//         this.scene.add.existing(this);

//         // Adding physics
//         this.scene.physics.add.existing(this);
//         this.body.setCollideWorldBounds(true);

//         this.facing = 'right';

//         // Set up keyboard input
//         this.cursors = this.scene.input.keyboard.addKeys({
//             left: Phaser.Input.Keyboard.KeyCodes.LEFT,
//             right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
//             up: Phaser.Input.Keyboard.KeyCodes.UP,
//             shoot: Phaser.Input.Keyboard.KeyCodes.D
//         });
//     }

//     update() {
//         if (this.cursors.up.isDown && this.body.touching.down) {
//             this.body.setVelocityY(-300);
//             console.log("something");
//         }

//         if (this.cursors.left.isDown) {
//             this.body.setVelocityX(-this.playerSpeed);
//             this.facing = 'left';
//             console.log("left");
//         } else if (this.cursors.right.isDown) {
//             this.body.setVelocityX(this.playerSpeed);
//             this.facing = 'right';
//             console.log("right");
//         } else {
//             this.body.setVelocityX(0);
//         }
//     }
// }

// Enemy.js
export class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemyTexture');
        this.scene = scene;

        // Initialize enemy properties
        // ...

        // Add the enemy to the scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
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

    update() {
        // Enemy update logic here
    }
}