import * as THREE from "https://unpkg.com/three@0.138.0/build/three.module.js";

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById("scene");
class Window {
    constructor() {
        this.init();
    }
    init() {
        if (!canvas) {
            warn("Canvas not found");
            return;
        }
        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvas
        });
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(canvas.clientWidth, canvas.clientHeight);



        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);
        document.addEventListener('viewresize', function() {
            if (canvas.parentElement.style.display == "none") {
                return;
            }
            app._OnWindowResize();
        });
        document.addEventListener('tabmoved', function(event) {
            if (event.detail.content.id === "Scene") {
                app._OnWindowResize(event.detail.parentNode);
            }
        });
        document.addEventListener('Sceneload', function() {
            console.log("test");
            app._OnWindowResize();
        });
        const fov = 60;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(75, 20, 0);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(20, 100, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this._scene.add(light);
        light = new THREE.AmbientLight(0x101010, 3);
        this._scene.add(light);
        
        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        controls.target.set(0, 20, 0);
        controls.update();
        
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFFF,
            }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
            }));
        box.position.set(0, 1, 0);
        box.castShadow = true;
        box.receiveShadow = true;
        this._scene.add(box);
        this.draw();


    } 
    _OnWindowResize(content) {
        const parent = content || canvas.parentElement;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(width, height);
    }
    draw() {
        requestAnimationFrame(() => {
            this._threejs.render(this._scene, this._camera);
            this.draw();
        })
    }
}
let app;
document.addEventListener('InitialSceneload', function() {
    app = new Window();
});
