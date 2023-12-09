// Level.js
export class Level {
    constructor(scene) {
        this.scene = scene;

        this.platHeight = 8;
        this.platWidth = 125;
        this.platColor = '0x7ed64b';
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

        // this.platforms.getChildren().forEach(platform => {
        //     this.scene.physics.add.existing(platform, true); // 'true' makes it static
        // });
    }

    // setupCollisions(assets) {
    //     for (const asset of assets) {
    //         this.scene.physics.add.collider(asset, this.ground);
    //         // this.scene.physics.add.collider(asset, this.platforms);
    //     }
    //     // Add more collision setups if necessary
    // }
    setupCollisions(assets) {
        // Collision with ground
        for (const asset of assets) {
            this.scene.physics.add.collider(asset, this.ground);
            // One-way collision with platforms
            // this.scene.physics.add.collider(asset, this.platforms, function(asset, platform) {

            //     return false; // No collision

            // }, null, this);
        }
    }
    setupPlatformCollisions(asset) {
        // Collision with ground
        // for (const asset of assets) {
        const myCollision = this.scene.physics.add.collider(asset, this.platforms);
        // console.log(myCollision);
        // One-way collision with platforms
        // this.scene.physics.add.collider(asset, this.platforms, function(asset, platform) {

        //     return false; // No collision

        // }, null, this);
        // }
        return myCollision;
    }
}