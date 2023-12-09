// Level.js
export class Level {
    constructor(scene) {
        this.scene = scene;
        this.ground = [];
        this.platforms = [];
        // this.platforms = this.physics.add.staticGroup();
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
        this.ground1 = this.scene.add.rectangle(0, 600, 2534, 100, 0x00FF00).setOrigin(0, 1);
        this.scene.physics.add.existing(this.ground1, true);

        // Elevated ground
        this.ground2 = this.scene.add.rectangle(1024, 500, 533, 100, 0x32a852).setOrigin(0, 1);
        this.scene.physics.add.existing(this.ground2, true);

        this.ground.push(this.ground1);
        this.ground.push(this.ground2);
    }

    createPlatforms() {

        // this.platforms.create(275, 400, 'platformTexture');
        // this.platforms.create(425, 400, 'platformTexture');
        // this.physics.add.collider(this.player, this.platforms);
        


    }

    setupCollisions(assets) {
        for (const asset of assets) {
            this.scene.physics.add.collider(asset, this.ground);
        }
        for (const asset of assets) {
            this.scene.physics.add.collider(asset, this.platforms);
        }
        // Add more collision setups if necessary
    }
}