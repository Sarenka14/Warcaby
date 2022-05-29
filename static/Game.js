import Pionek from "./Pionek.js";
import Pole from "./Pole.js";
export default class Game {


    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xA9A9A9);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.doneW = false
        this.doneB = false


        this.szachownica = [
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];

        this.pionki = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ]

        this.tablicaPol = []
        this.przesylanaTablica = []

        this.board()

        document.getElementById("root").append(this.renderer.domElement);

        this.camera.position.set(0, 100, 100)
        this.camera.lookAt(this.scene.position)

        this.render() // wywołanie metody render
        this.block = new THREE.Object3D()

        this.playerWhiteTurn = true
        this.playerBlackTurn = false

        //-----------------------reycaster----------------------------

        const raycaster = new THREE.Raycaster(); // obiekt Raycastera symulujący "rzucanie" promieni
        const mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D
        this.lastClicked = new THREE.Mesh()
        this.isClickedPawn

        this.checkMove = () => {
            fetch("/zmianaPoRuchu", { method: "post" })
                .then(response => response.json())
                .then(
                    data => {
                        let cos = this.block.children.filter((pionek) => {
                            return (pionek.position.z == 14 * (data.oldPosition[0] - 3.5) && pionek.position.x == 14 * (data.oldPosition[1] - 3.5))
                        })
                        try {
                            new TWEEN.Tween(cos[0].position) // co
                                .to({ x: 14 * (data.newPosition[1] - 3.5), z: 14 * (data.newPosition[0] - 3.5) }, 500) // do jakiej pozycji, w jakim czasie
                                .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
                                .start()

                            // console.log(cos[0].material.color.getHex())
                            // if (cos[0].material.color.getHex() == 0xFFFFFF) {
                            //     console.log("biały się ruszył")
                            // } else if (cos[0].material.color.getHex() == 0x555555) {
                            //     console.log("czarny się ruszył")
                            // }
                        } catch (error) { }





                    }
                )
        }

        window.addEventListener("mousedown", (e) => {
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children);
            if (playerWhiteLoggedIn) { // Pierwszy gracz zalogowany
                if (intersects.length > 0 && intersects[0].object.type == "pawn" && intersects[0].object.material.color.getHex() == 0xDCDCDC) {
                    this.lastClicked.material.color.setHex(0xDCDCDC)
                    intersects[0].object.material.color.setHex(0xFFFF00)
                    this.lastClicked = intersects[0].object
                    this.isClickedPawn = true
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 8; j++) {
                            if (this.tablicaPol[i][j].material.color.getHex() != 0xFFFFFF) {
                                this.tablicaPol[i][j].material.color.setHex(0x555555)
                            }
                        }
                    }
                    try {
                        this.tablicaPol[(intersects[0].object.position.z / 14 + 3.5) - 1][(intersects[0].object.position.x / 14 + 3.5) - 1].ustawianieKoloru(0x00FF00)

                    } catch (error) { }
                    try {
                        this.tablicaPol[(intersects[0].object.position.z / 14 + 3.5) - 1][(intersects[0].object.position.x / 14 + 3.5) + 1].ustawianieKoloru(0x00FF00)
                    } catch (error) { }


                }
                if (intersects.length > 0 && intersects[0].object.type != "pawn" && this.isClickedPawn == true && intersects[0].object.material.color.getHex() == 0x00FF00) {
                    this.tablicaPol[this.lastClicked.position.z / 14 + 3.5][this.lastClicked.position.x / 14 + 3.5].zajete = false
                    this.pionki[this.lastClicked.position.z / 14 + 3.5][this.lastClicked.position.x / 14 + 3.5] = 0
                    let staraPozycja = [this.lastClicked.position.z / 14 + 3.5, this.lastClicked.position.x / 14 + 3.5]
                    new TWEEN.Tween(this.lastClicked.position) // co
                        .to({ x: intersects[0].object.position.x, z: intersects[0].object.position.z }, 500) // do jakiej pozycji, w jakim czasie
                        .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
                        .start()
                    this.lastClicked.material.color.setHex(0xDCDCDC)
                    this.tablicaPol[intersects[0].object.position.z / 14 + 3.5][intersects[0].object.position.x / 14 + 3.5].zajete = true
                    this.pionki[intersects[0].object.position.z / 14 + 3.5][intersects[0].object.position.x / 14 + 3.5] = 1
                    let nowaPozycja = [intersects[0].object.position.z / 14 + 3.5, intersects[0].object.position.x / 14 + 3.5]
                    fetch("/ruch", { method: "post", body: JSON.stringify({ staraPozycja, nowaPozycja }) })
                    this.isClickedPawn = false
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 8; j++) {
                            if (this.tablicaPol[i][j].material.color.getHex() != 0xFFFFFF) {
                                this.tablicaPol[i][j].material.color.setHex(0x555555)
                            }
                        }
                    }

                }
            } else if (playerBlackLoggedIn) { // Drugi gracz zalogowany
                if (intersects.length > 0 && intersects[0].object.type == "pawn" && intersects[0].object.material.color.getHex() == 0xFF0000) {
                    this.lastClicked.material.color.setHex(0xff0000)
                    intersects[0].object.material.color.setHex(0xFFFF00)
                    this.lastClicked = intersects[0].object
                    this.isClickedPawn = true
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 8; j++) {
                            if (this.tablicaPol[i][j].material.color.getHex() != 0xFFFFFF) {
                                this.tablicaPol[i][j].material.color.setHex(0x555555)
                            }
                        }
                    }
                    try {
                        this.tablicaPol[(intersects[0].object.position.z / 14 + 3.5) + 1][(intersects[0].object.position.x / 14 + 3.5) + 1].ustawianieKoloru(0x00FF00)

                    } catch (error) { }
                    try {
                        this.tablicaPol[(intersects[0].object.position.z / 14 + 3.5) + 1][(intersects[0].object.position.x / 14 + 3.5) - 1].ustawianieKoloru(0x00FF00)
                    } catch (error) { }
                }
                if (intersects.length > 0 && intersects[0].object.type != "pawn" && this.isClickedPawn == true && intersects[0].object.material.color.getHex() == 0x00FF00) {
                    this.tablicaPol[this.lastClicked.position.z / 14 + 3.5][this.lastClicked.position.x / 14 + 3.5].zajete = false
                    this.pionki[this.lastClicked.position.z / 14 + 3.5][this.lastClicked.position.x / 14 + 3.5] = 0
                    let staraPozycja = [this.lastClicked.position.z / 14 + 3.5, this.lastClicked.position.x / 14 + 3.5]
                    new TWEEN.Tween(this.lastClicked.position) // co
                        .to({ x: intersects[0].object.position.x, z: intersects[0].object.position.z }, 500) // do jakiej pozycji, w jakim czasie
                        .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
                        .start()
                    this.lastClicked.material.color.setHex(0xff0000)
                    this.tablicaPol[intersects[0].object.position.z / 14 + 3.5][intersects[0].object.position.x / 14 + 3.5].zajete = true
                    this.pionki[intersects[0].object.position.z / 14 + 3.5][intersects[0].object.position.x / 14 + 3.5] = 2
                    let nowaPozycja = [intersects[0].object.position.z / 14 + 3.5, intersects[0].object.position.x / 14 + 3.5]
                    fetch("/ruch", { method: "post", body: JSON.stringify({ staraPozycja, nowaPozycja }) })
                    this.isClickedPawn = false
                    for (let i = 0; i < 8; i++) {
                        for (let j = 0; j < 8; j++) {
                            if (this.tablicaPol[i][j].material.color.getHex() != 0xFFFFFF) {
                                this.tablicaPol[i][j].material.color.setHex(0x555555)
                            }
                        }
                    }
                }
            }

        });

        this.onWindowResize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', this.onWindowResize, false);

        setInterval(this.checkMove, 500);


    }



    makeWhitePons() {
        this.pawns()
        this.camera.position.set(0, 100, 100)
    }

    makeBlackPons() {
        this.pawns()
        this.camera.position.set(0, 100, -100)
    }

    board = () => {
        for (let i = 0; i < 8; i++) {
            let rzad = []
            for (let j = 0; j < 8; j++) {
                if (this.szachownica[i][j] == 0) {
                    const cube = new Pole(0xFFFFFF)
                    cube.position.set(14 * (j - 3.5), 15, 14 * (i - 3.5))
                    this.scene.add(cube);
                    rzad.push(cube)

                }
                else {
                    const cube = new Pole(0x555555)
                    cube.position.set(14 * (j - 3.5), 15, 14 * (i - 3.5))
                    this.scene.add(cube);
                    if (this.pionki[i][j] != 0) {
                        cube.zajete = true
                    } else {
                        cube.zajete = false
                    }
                    rzad.push(cube)
                }
            }
            this.tablicaPol.push(rzad)
        }
    }

    pawns = () => {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.pionki[i][j] == 1) {
                    let pionek = new Pionek(0xDCDCDC)
                    this.block.add(pionek);
                    pionek.position.set(14 * (j - 3.5), 19, 14 * (i - 3.5))
                }
                else if (this.pionki[i][j] == 2) {
                    let pionek = new Pionek(0xff0000)
                    this.block.add(pionek);
                    pionek.position.set(14 * (j - 3.5), 19, 14 * (i - 3.5))

                }
            }
        }
        this.scene.add(this.block)
    }



    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        this.camera.lookAt(this.scene.position)
        TWEEN.update();

        if (this.doneW != true || this.doneB != true) {
            if (playerWhiteLoggedIn) {
                this.doneW = true
                if (renderWhite == false) {
                    this.makeWhitePons()
                    renderWhite = true
                }
            }
            if (playerBlackLoggedIn) {
                this.doneB = true
                if (renderBlack == false) {
                    this.makeBlackPons()
                    renderBlack = true
                }
            }
        }
    }
}
