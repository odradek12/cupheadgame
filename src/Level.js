// Level.js
export class Level {
    constructor(scene) {
        this.scene = scene;

        this.platHeight = 8;
        this.platWidth = 125;
        this.platColor = '0x7ed64b';
        this.enemySpawnY = '450';
        this.enemySpawnPoints = [{
                x: 600,
                y: this.enemySpawnY ,
                spawned: false
            }, {
                x: 1200,
                y: this.enemySpawnY ,
                spawned: false
            },
            // ... more spawn points ...
        ];
    }

    preload() {}

    create() {
        this.createGround();

        this.createPlatforms();

    }

    createGround() {
        // Initial flat ground
        this.ground = this.scene.physics.add.staticGroup();

        this.ground1 = this.scene.add.rectangle(0, 600, 2534, 100, 0x00FF00).setOrigin(0, 1);
        this.ground2 = this.scene.add.rectangle(1024, 500, 533, 100, 0x32a852).setOrigin(0, 1);

        this.ground.add(this.ground1);
        this.ground.add(this.ground2);
    }

    createPlatforms() {
        // this.platforms = this.scene.physics.add.staticGroup();
        this.platforms = this.scene.physics.add.staticGroup();

        this.platform1 = this.scene.add.rectangle(275, 400, this.platWidth, this.platHeight, this.platColor).setOrigin(0, 1);
        this.platform2 = this.scene.add.rectangle(475, 400, this.platWidth, this.platHeight, this.platColor).setOrigin(0, 1);

        this.platforms.add(this.platform1);
        this.platforms.add(this.platform2);
    }

    setupCollisions(assets) {
        // Collision with ground
        for (const asset of assets) {
            this.scene.physics.add.collider(asset, this.ground);
        }
    }
    setupPlatformCollisions(asset) {
        // Collision with platform
        const myCollision = this.scene.physics.add.collider(asset, this.platforms);
        return myCollision;
    }
}