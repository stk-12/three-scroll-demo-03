import '../css/style.scss'
import { radian } from './utils';
import * as THREE from 'three';
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import Lenis from '@studio-freight/lenis';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"


class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.bgColors = [
      '#FFB30E',

    ];
    this.colors = [
      '#F5CB00',
      '#33A9B6',
      '#92D537',
      '#8B52B6',
    ]

    this.canvas = document.querySelector("#canvas");

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);

    this.scene = new THREE.Scene();
    this.camera = null;

    this.distance = null;

    this.mesh = null;
    this.group = new THREE.Group();

    // this.controls = null;

    this.lenis = new Lenis({
      duration: 1.5,
      // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // direction: 'vertical', // vertical, horizontal
      // gestureDirection: 'vertical', // vertical, horizontal, both
      // smooth: true,
      // mouseMultiplier: 1,
      // smoothTouch: false,
      // touchMultiplier: 2,
      // infinite: false,
    });


    this._init();
    this._update();
    this._addEvent();

    this._setAnimation();


    // lenis
    // this._getScrollValue();
  }

  _setCamera() {
    // this.camera = new THREE.PerspectiveCamera(45, this.viewport.width / this.viewport.height, 1, 100);
    // this.camera.position.set(0, 0, 5);
    // this.scene.add(this.camera);

    //ウインドウとWebGL座標を一致させる
    const fov = 45;
    const fovRadian = (fov / 2) * (Math.PI / 180); //視野角をラジアンに変換
    this.distance = (this.viewport.height / 2) / Math.tan(fovRadian); //ウインドウぴったりのカメラ距離
    this.camera = new THREE.PerspectiveCamera(fov, this.viewport.width / this.viewport.height, 1, this.distance * 2);
    this.camera.position.z = this.distance;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  // _setControlls() {
  //   this.controls = new OrbitControls(this.camera, this.canvas);
  //   this.controls.enableDamping = true;
  // }

  _setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1);
    this.scene.add(light);
  }

  _addMesh() {
    const geometry = new THREE.DodecahedronGeometry(50, 0);

    for(let i = 0; i < 4; i++){
      let material = new THREE.MeshStandardMaterial({
        color: this.colors[i],
        opacity: 0.8,
        transparent: true,
        roughness: 0,
        // envMap: textureCube,
      });


      const mesh1 = new THREE.Mesh(geometry, material);
      mesh1.material.side = THREE.BackSide; // back faces
      mesh1.renderOrder = 0;

      const mesh2 = new THREE.Mesh(geometry, material.clone());
      mesh2.material.side = THREE.FrontSide; // front faces
      mesh2.renderOrder = 1;

      mesh1.position.z = 200 * Math.sin((i / 4) * Math.PI * 2);
      mesh2.position.z = 200 * Math.sin((i / 4) * Math.PI * 2);
      mesh1.position.x = 200 * Math.cos((i / 4) * Math.PI * 2);
      mesh2.position.x = 200 * Math.cos((i / 4) * Math.PI * 2);
      
      this.group.add(mesh1, mesh2);
    }

    this.group.position.z = this.distance;
    this.group.rotation.x = radian(90);
    
  }

  // _getScrollValue() {
  //   this.lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
  //     console.log({ scroll, limit, velocity, direction, progress })
  //   })
  // }

  _setAnimation() {

    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: '#section01',
        start: 'top top',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
        markers: true,
        scrub: true,
      }
    });
    tl1.to(this.group.rotation, {
      x: radian(0),
      // duration: 1.6,
      ease: "Linear.easeNone",
    })


    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: '#section03',
        start: 'top top',
        toggleActions: 'play none none reverse',
        markers: true,
      }
    });
    tl2.to(this.group.rotation, {
      y: radian(90),
      duration: 1.2,
      ease: "Expo.easeInOut",
    })
    // .to('.scroll', {
    //   background: this.bgColors[0],
    //   duration: 0.2,
    //   ease: "Linear.easeNone",
    // })


    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: '#section04',
        start: 'top top',
        toggleActions: 'play none none reverse',
        markers: true,
      }
    });
    tl3.to(this.group.rotation, {
      y: radian(180),
      duration: 1.2,
      ease: "Expo.easeInOut",
    })


    const tl4 = gsap.timeline({
      scrollTrigger: {
        trigger: '#section05',
        start: 'top top',
        toggleActions: 'play none none reverse',
        markers: true,
      }
    });
    tl4.to(this.group.rotation, {
      y: radian(270),
      duration: 1.2,
      ease: "Expo.easeInOut",
    })
    
  }



  _init() {
    this.scene.add(this.group);
    this._setCamera();
    // this._setControlls();
    this._setLight();
    this._addMesh();
  }

  _update(time) {

    this.lenis.raf(time);

    for(let i = 0; i < this.group.children.length; i++) {
      this.group.children[i].rotation.y += 0.005;
    }
    
    //レンダリング
    this.renderer.render(this.scene, this.camera);
    // this.controls.update();
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }
}

new Main();


