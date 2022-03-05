
let velocidadHieloco = 10;
let velocidadRotacion = 0.01;

class Hielo extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'hieloco');
        scene.add.existing(this);
        this.setInteractive();
    }

    preUpdate()
    {
        this.update();
    }

    update()
    {
        this.y += velocidadHieloco;
        this.rotation += velocidadRotacion;

        if(this.y > (ALTO+100)){
            this.removeInteractive();
            this.removedFromScene();
            this.destroy();
        }
    }
}