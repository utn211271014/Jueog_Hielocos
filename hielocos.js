const ANCHO = 540;
const ALTO = 960; 
let velocidadFondo = 5;
let anchoCarril = (ANCHO/3);
let arrayCarril = [((anchoCarril*0)+(anchoCarril/2)), ((anchoCarril*1)+(anchoCarril/2)), ((anchoCarril*2)+(anchoCarril/2))];
let temporizadorHielocos = null;
let deltaHieloco = 500;
let textoPuntaje = null;
let puntos = 0;
let grupoHielos = null;
let vidas = 3;
let estoyVivo = true;

class Hielocos extends Phaser.Scene
{
    constructor()
    {
        super('Hielocos');
    }

    preload()
    {
        this.load.setBaseURL('https://www.antonio.com.mx');
        this.load.image('fondo_oceano', 'imagenes/fondo_oceano.jpg');
        this.load.spritesheet('pinguino', 'imagenes/pinguino.png', {frameWidth:30, frameHeight:43});
        this.load.image('hieloco', 'imagenes/hieloco.png');
    }

    create()
    {
        this.scale.displaySize.setAspectRatio( ANCHO/ALTO);
        this.scale.refresh();
        this.fondo = this.add.tileSprite(0,0,0,0, 'fondo_oceano')
        .setOrigin(0)
        .setScrollFactor(0,1);
        this.fondo.displayWidth = this.sys.canvas.width;
        const animacionPinguino = this.anims.create({
            key: 'nadar',
            frames: this.anims.generateFrameNumbers('pinguino'),
            frameRate: 15,
            repeat: -1
        });
        const spritePinguino = this.physics.add.sprite(arrayCarril[1], 900, 'pinguino').setScale(2);
        spritePinguino.anims.load('nadar');
        spritePinguino.anims.play('nadar');
        temporizadorHielocos = 0;
        this.textoPuntaje = this.add.text((ANCHO/2)-50,10, 'Puntos\n0', {fontFamily: 'Arial', fontSize: '24px', fill: '#FFFFFF', align: 'center'});
        grupoHielos = this.physics.add.group();
        this.input.on('pointerdown', function(pointer){
            let puntoX = pointer.x;
            let carril = Math.floor(puntoX / anchoCarril);
            carril = Math.max(Math.min(2,carril),0);
            spritePinguino.x = arrayCarril[carril];
        });

        this.physics.add.collider(spritePinguino, grupoHielos, function (pinguinito, hielitos)
        {   
            if(pinguinito.body.touching && hielitos.body.touching)
            {
                hielitos.removeInteractive();
                hielitos.removedFromScene();
                hielitos.destroy();
                vidas--;
                console.log('Vidas: ' + vidas);
                if(vidas < 0)
                {
                    spritePinguino.removeInteractive();
                    spritePinguino.removedFromScene();
                    spritePinguino.destroy();
                    estoyVivo = false;
                    console.log('Moriste');
                    terminar();
                }
            }
        });

        function terminar()
        {
            juego.scene.remove('Hielocos');
            juego.scene.start('GameOver');
        }
    }

    update(tiempo, delta)
    {
        this.fondo.tilePositionY -= velocidadFondo;
        temporizadorHielocos += delta;
        while((temporizadorHielocos > deltaHieloco) && estoyVivo)
        {
            temporizadorHielocos -= deltaHieloco;
            let carril = Math.floor(Math.random() * 3);
            let hielo = new Hielo(this, arrayCarril[ carril ], 0);
            grupoHielos.add(hielo);
            if(estoyVivo){
                puntos++;
            }
            this.textoPuntaje.setText('Puntos\n' + puntos);
        }
    }
}

const configuration = 
{
    type: Phaser.AUTO,
    width: ANCHO,
    height: ALTO,
    backgroundColor: '#072F53',
    pixeArt: true,
    physics:{
        default : 'arcade',
        arcade: {
            debug: true
        }
    },
    scale:{
        mode: Phaser.Scale.FIT,
    },
    scene: [Hielocos, GameOver]
};

const juego = new Phaser.Game(configuration);

