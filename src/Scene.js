import * as THREE from 'three';
import { TweenMax, Sine } from 'gsap';

import projects from './projects.js';

export default class Scene {
  constructor(container, showProjectImage, hideProjectImage) {
    this.container = container;
    this.circles = [];

    this.keys = Object.keys(projects);
    this.showProjectImage = showProjectImage;
    this.hideProjectImage = hideProjectImage;

    this.closestMesh = null;

    this.init();
    this.addLights();

    setTimeout(() => {
      this.addSpokes();
    }, 1700);

    this.addRayCasting();

    TweenMax.fromTo(this.scene.rotation, 1, { z: 0 }, { z: 2 });

    this.loop();

    window.addEventListener('resize', () => this.handleResize());
  }

  width() {
    return window.innerWidth;
  }

  height() {
    return window.innerHeight;
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width() / this.height(),
      1,
      2000
    );
    this.camera.position.set(0, 0, 50);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio = window.devicePixelRatio;
    this.renderer.setSize(this.width(), this.height());

    this.container.appendChild(this.renderer.domElement);
  }

  addLights() {
    const light = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(light);
  }

  addSpokes() {
    let numSpokes = 50;
    let maxLineLength = 25;

    if (this.width() < 1024) {
      numSpokes = 35;
      maxLineLength = 15;
    }

    const points = Array(numSpokes - this.keys.length).fill(false);
    const allPoints = points.concat(this.keys);
    this.shuffle(allPoints);

    for (let i = 0; i < allPoints.length; i++) {
      setTimeout(() => {
        const anchor = new THREE.Object3D();

        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x8c95aa,
          opacity: 0.7
        });
        const lineGeometry = new THREE.Geometry();
        const lineLength = this.randomize(10, maxLineLength);
        lineGeometry.vertices.push(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(lineLength, 0, 0)
        );
        const line = new THREE.Line(lineGeometry, lineMaterial);
        anchor.add(line);

        const circleGeometry = new THREE.CircleGeometry(0.3, 64);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xb9a7c2 });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.x += this.randomize(5, lineLength);
        TweenMax.fromTo(
          circle.scale,
          0.3,
          { x: 0.1, y: 0.1, z: 0.1 },
          { x: 1, y: 1, z: 1, delay: 0.5, ease: Sine.easeIn }
        );
        anchor.add(circle);

        if (allPoints[i]) {
          const circleTwoGeometry = new THREE.CircleGeometry(
            this.randomize(0.9, 1.2),
            64
          );
          const circleTwoMaterial = new THREE.MeshBasicMaterial({
            color: 0xceffce
          });
          const circleTwo = new THREE.Mesh(
            circleTwoGeometry,
            circleTwoMaterial
          );
          circleTwo.projectKey = allPoints[i];
          circleTwo.position.x += this.randomize(10, lineLength);
          TweenMax.fromTo(
            circleTwo.scale,
            0.2,
            { x: 0.1, y: 0.1, z: 0.1 },
            { x: 1, y: 1, z: 1, delay: 1.5, ease: Sine.easeIn }
          );
          anchor.add(circleTwo);

          this.circles.push(circleTwo);
        }

        anchor.rotation.z += Math.PI * 2 / numSpokes * i;
        TweenMax.fromTo(
          anchor.scale,
          0.3,
          { x: 0.1, y: 0.1, z: 0.1 },
          { x: 1, y: 1, z: 1, ease: Sine.easeIn }
        );
        this.scene.add(anchor);
      }, 20 * i);
    }
  }

  shuffle(a) {
    let j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }

  randomize(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  addRayCasting = () => {
    this.raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    this.container.addEventListener(
      'click',
      e => {
        mouseVector.x = 2 * (e.offsetX / this.width()) - 1;
        mouseVector.y = 1 - 2 * (e.offsetY / this.height());
        this.raycaster.setFromCamera(mouseVector.clone(), this.camera);

        const intersects = this.raycaster.intersectObjects(this.circles);
        if (intersects.length > 0) {
          const closest = intersects[0];
          this.showProjectImage(
            closest.object.projectKey,
            e.offsetX,
            e.offsetY
          );
        } else {
          this.hideProjectImage();
        }
      },
      false
    );

    this.container.addEventListener(
      'mousemove',
      e => {
        mouseVector.x = 2 * (e.offsetX / this.width()) - 1;
        mouseVector.y = 1 - 2 * (e.offsetY / this.height());

        this.scene.position.x = mouseVector.x;
        this.scene.position.y = mouseVector.y;

        this.raycaster.setFromCamera(mouseVector.clone(), this.camera);

        const intersects = this.raycaster.intersectObjects(this.circles);
        const closest = intersects[0];

        if (closest && !this.closestMesh) {
          this.closestMesh = closest.object;
          this.expand(this.closestMesh);
        } else if (!closest && this.closestMesh) {
          this.unexpand(this.closestMesh);
          this.closestMesh = null;
        }
      },
      false
    );
  };

  expand(mesh) {
    TweenMax.to(mesh.scale, 0.5, { x: 2, y: 2, z: 2, ease: Sine.easeIn });
  }

  unexpand(mesh) {
    TweenMax.to(mesh.scale, 0.5, { x: 1, y: 1, z: 1, ease: Sine.easeIn });
  }

  handleResize() {
    this.renderer.setSize(this.width(), this.height());
    this.camera.aspect = this.width() / this.height();
    this.camera.updateProjectionMatrix();
  }

  loop() {
    this.render();
    requestAnimationFrame(() => {
      this.loop();
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
