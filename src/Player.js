export class Player extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color) {
        super(scene, x, y, width, height, color);
        this.scene = scene;

        // Initialize player properties
        this.playerSpeed = 250;

        // Add the player to the scene
        this.scene.add.existing(this);

        // Adding physics
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        // Player's initial facing direction
        this.facing = 'right';

        // Set up keyboard input
        this.cursors = this.scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            shoot: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        // Update logic for the player
        if (this.cursors.up.isDown && this.body.touching.down) {
            this.body.setVelocityY(-300);
            console.log("something");
        }

        if (this.cursors.left.isDown) {
            this.body.setVelocityX(-this.playerSpeed);
            this.facing = 'left';
            console.log("left");
        } else if (this.cursors.right.isDown) {
            this.body.setVelocityX(this.playerSpeed);
            this.facing = 'right';
            console.log("right");
        } else {
            this.body.setVelocityX(0);
        }
    }
}