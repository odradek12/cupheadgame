// Level.js
export class Level {
    constructor(scene) {
        this.scene = scene;
    }

    preload() {
        // Preload platform texture
        let graphics = this.scene.make.graphics({
            x: 0,
            y: 0,
            add: false
        });
        graphics.fillStyle(0x008800, 1);
        graphics.fillRect(0, 0, 50, 10);
        graphics.generateTexture('platformTexture', 50, 10);
        graphics.clear();
    }

    create() {
        this.createGround();

        this.createPlatforms();
    }

    createGround() {
        // Initial flat ground
        this.ground1 = this.scene.add.rectangle(0, 600, 2134, 100, 0x00FF00).setOrigin(0, 1);
        this.scene.physics.add.existing(this.ground1, true);

        // Elevated ground
        this.ground2 = this.scene.add.rectangle(1067 + (533 / 2), 500, 533, 100, 0x32a852).setOrigin(0, 1);
        this.scene.physics.add.existing(this.ground2, true);
    }

    createPlatforms() {
        // Create platforms here if needed
        // e.g., this.platforms = this.scene.add.staticGroup();
    }

    setupCollisions(assets) {
        // for (let i = 0; i < assets.length; i++) {
        for (const asset of assets) {
            this.scene.physics.add.collider(asset, [this.ground1, this.ground2]);
        }
        // Add more collision setups if necessary
    }
}