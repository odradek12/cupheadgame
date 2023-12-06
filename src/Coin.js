export class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'coinTexture');
        this.scene = scene;

        // Add the coin to the scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true); // true for static
    }

    static preload(scene) {
        // Create a graphics object to draw the coin
        let graphics = scene.make.graphics({
            x: 0,
            y: 0,
            add: false
        });
        graphics.lineStyle(3, 0xFFFF00, 1);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(10, 10);
        graphics.moveTo(10, 0);
        graphics.lineTo(0, 10);
        graphics.closePath();
        graphics.strokePath();

        // Generate a texture from the graphics object
        graphics.generateTexture('coinTexture', 10, 10);
        graphics.clear();
    }

    static createCoins(scene, positions) {
        const coins = scene.physics.add.staticGroup();
        positions.forEach(pos => {
            coins.create(pos.x, pos.y, 'coinTexture');
        });
        return coins;
    }

    static collectItem(player, coin) {
        coin.destroy();
    }
}