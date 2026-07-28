import * as THREE from "https://esm.sh/three@0.179.1";
import { GLTFLoader } from "https://esm.sh/three@0.179.1/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

document.querySelectorAll(".model-slot").forEach((container) => {
  // Salta gli slot placeholder che non hanno ancora un modello assegnato
  if (!container.dataset.model) return;
  createViewer(container);
});

function createViewer(container) {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(5, 5, 5);
    scene.add(light);

    let model;

    loader.load(container.dataset.model, (gltf) => {

        model = gltf.scene;
        scene.add(model);

        // Bounding box iniziale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Centra il modello
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        // Scala automaticamente
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 2.2;
        const scale = targetSize / maxDim;

        model.scale.setScalar(scale);

        // Bounding box DOPO la scala
        const newBox = new THREE.Box3().setFromObject(model);
        const sphere = newBox.getBoundingSphere(new THREE.Sphere());

        // --- Calcolo corretto della distanza camera ---
        // Distanza minima perché l'intera sfera stia dentro il FOV verticale
        const fovVerticalRad = (camera.fov * Math.PI) / 180;
        const distForHeight = sphere.radius / Math.sin(fovVerticalRad / 2);

        // Distanza minima perché stia dentro il FOV orizzontale (dipende dall'aspect)
        const fovHorizontalRad = 2 * Math.atan(Math.tan(fovVerticalRad / 2) * camera.aspect);
        const distForWidth = sphere.radius / Math.sin(fovHorizontalRad / 2);

        // Prendi la distanza maggiore delle due (quella che vincola di più),
        // con un 25% di margine extra così l'oggetto non tocca i bordi
        const distance = Math.max(distForHeight, distForWidth) * 1.3;

        camera.position.set(
            sphere.center.x,
            sphere.center.y,
            sphere.center.z + distance
        );

        camera.lookAt(sphere.center.x, sphere.center.y, sphere.center.z);
        camera.near = distance / 100;
        camera.far = distance * 10;
        camera.updateProjectionMatrix();

    });

    function animate() {

        requestAnimationFrame(animate);

        if (model) {

            model.rotation.y += 0.004;

        }

        renderer.render(scene, camera);

    }

    animate();

    window.addEventListener("resize", () => {

        camera.aspect = container.clientWidth / container.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);

    });

}
