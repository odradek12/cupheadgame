// Health.js
export class Health {
    constructor(scene, initialHealth) {
        this.scene = scene;
        this.health = initialHealth;
        this.maxHealth = initialHealth;

        // Create a text element for the health counter
        this.healthText = this.scene.add.text(10, 10, `Health: ${this.health}`, {
            fontSize: '16px',
            fill: '#ffffff'
        });
    }

    decreaseHealth(amount) {
        this.health = Math.max(this.health - amount, 0);
        this.updateHealthText();

        if (this.health <= 0) {
            // Handle player death if necessary
            console.log("player dead");
        }
    }

    updateHealthText() {
        this.healthText.setText(`Health: ${this.health}`);
    }

    // Additional methods can be added here for increasing health, etc.
}
