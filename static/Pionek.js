export default class Pionek extends THREE.Mesh {
    constructor(color) {
        const geometryCylindra = new THREE.CylinderGeometry(6, 6, 3, 16)
        const material = new THREE.MeshBasicMaterial({
            color: color,
            side: THREE.DoubleSide, // dwustronny
            map: new THREE.TextureLoader().load('mats/wood.jpg'), // plik tekstury
            transparent: true, // przezroczysty / nie
        });

        super(geometryCylindra, material)
        this.type = "pawn"
    }
}