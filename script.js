
class Pokemon {
    constructor(nome, x, y, colore, hp) {
        this.nome = nome;
        this.x = x;
        this.y = y; 
        this.colore = colore; 
        this.hp = hp;
        this.maxHp = hp;
    }

    disegna(ctx) {
        ctx.fillStyle = this.colore;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2); 
        ctx.fill();
        
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 30, this.y - 50, 60, 10);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - 30, this.y - 50, (this.hp / this.maxHp) * 60, 10);
    }

    attacca(bersaglio) {
        const danno = Math.floor(Math.random() * 20) + 10;
        bersaglio.hp -= danno;
        if (bersaglio.hp < 0) bersaglio.hp = 0;
        console.log(`${this.nome} ha fatto ${danno} danni a ${bersaglio.nome}!`);
    }
}
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = new Pokemon("Pikachu", 200, 200, "yellow", 100);
const nemico = new Pokemon("Charizard", 600, 200, "orange", 120);

function rendering() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    player.disegna(ctx);
    nemico.disegna(ctx);
    requestAnimationFrame(rendering); 
}

function faseAttacco() {
    player.attacca(nemico);

    if (nemico.hp > 0) {
        setTimeout(() => nemico.attacca(player), 1000);
    }
}

rendering(); 
class Effetto {
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.frame = 0;
        this.finito = false;
    }

    disegna(ctx) {
        this.frame++;
        ctx.save();
        
        if (this.tipo === 'elettro') {
           
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - 50);
            ctx.lineTo(this.x + 10, this.y - 20);
            ctx.lineTo(this.x - 10, this.y + 10);
            ctx.stroke();
        } 
        else if (this.tipo === 'fuoco') {
            
            ctx.fillStyle = "orange";
            ctx.globalAlpha = 1 - (this.frame / 20); 
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.frame * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
        if (this.frame > 20) this.finito = true; 
    }
}
class Pokemon {
    constructor(nome, x, y, colore, hp, tipoMossa) {
        this.nome = nome;
        this.x = x;
        this.y = y;
        this.colore = colore;
        this.hp = hp;
        this.maxHp = hp;
        this.tipoMossa = tipoMossa;
    }

    disegna(ctx) {
        ctx.fillStyle = this.colore;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
    }

    lanciaMossa(bersaglio, listaEffetti) {
        const danno = 20;
        bersaglio.hp -= danno;

        listaEffetti.push(new Effetto(bersaglio.x, bersaglio.y, this.tipoMossa));
    }
}
const effettiAttivi = [];
const pika = new Pokemon("Pikachu", 200, 200, "yellow", 100, "elettro");
const char = new Pokemon("Charizard", 600, 200, "orange", 150, "fuoco");

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pika.disegna(ctx);
    char.disegna(ctx);

    // Gestione effetti
    for (let i = effettiAttivi.length - 1; i >= 0; i--) {
        effettiAttivi[i].disegna(ctx);
        if (effettiAttivi[i].finito) {
            effettiAttivi.splice(i, 1); 
        }
    }

    requestAnimationFrame(update);
}

function attaccoGiocatore() {
    pika.lanciaMossa(char, effettiAttivi);

    setTimeout(() => {
        if (char.hp > 0) char.lanciaMossa(pika, effettiAttivi);
    }, 800);
}

update();