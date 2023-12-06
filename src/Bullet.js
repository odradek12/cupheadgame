// Bullet.js
export class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction) {
        super(scene, x, y, 'bulletTexture');
        this.scene = scene;
        this.direction = direction;
        this.bulletSpeed = 1200;

        // Add the bullet to the scene and set up physics
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setVelocityX(this.direction === 'right' ? this.bulletSpeed : -this.bulletSpeed);
        this.body.setCollideWorldBounds(false);
        this.body.allowGravity = false;
        this.setActive(true);
        this.setVisible(true);
    }

    static preload(scene) {
        let graphics = scene.make.graphics({
            x: 0,
            y: 0,
            add: false
        });
        graphics.fillStyle(0xFF0000, 1);
        graphics.fillRect(0, 0, 20, 4);
        graphics.generateTexture('bulletTexture', 20, 4);
        graphics.clear();
    }
    static fireBullet(scene, x, y, direction) {
        const time = scene.time.now;

        if (!scene.lastFired || time - scene.lastFired > 500) {
            scene.lastFired = time;
            return new Bullet(scene, x, y, direction);
        }

        return null;
    }
}