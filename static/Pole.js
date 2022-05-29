export default class Pole extends THREE.Mesh {
    constructor(color) {
        const geometry = new THREE.BoxGeometry(14, 5, 14);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load('mats/wood.jpg'), // plik tekstury
            transparent: true, // przezroczysty / nie
        });

        super(geometry, material)
    }
    ustawianieKoloru(color) {
        if (this.zajete == false) {
            this.material.color.setHex(color)
        }
    }
}