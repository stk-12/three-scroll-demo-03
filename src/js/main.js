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

    this.geometries = [
      new THREE.ConeGeometry(40, 80, 40),
      new THREE.TorusGeometry(40, 20, 40, 40),
      new THREE.CylinderGeometry(40, 40, 80, 40),
      new THREE.SphereGeometry(50, 46, 46),
    ]

    // this.mesh = null;
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

    for(let i = 0; i < 4; i++){
      const geometry = this.geometries[i];
      const material = new THREE.MeshToonMaterial({ color: this.colors[i] });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = 200 * Math.sin((i / 4) * Math.PI * 2);
      mesh.position.x = 200 * Math.cos((i / 4) * Math.PI * 2);   
      this.group.add(mesh);
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
        // markers: true,
        scrub: true,
      }
    });
    tl1.to(this.group.rotation, {
      x: radian(0),
      ease: "Linear.easeNone",
    })


    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: '#section03',
        start: '10% center',
        toggleActions: 'play none none reverse',
        // markers: true,
      }
    });
    tl2.to(this.group.rotation, {
      y: radian(90),
      duration: 1.2,
      ease: "Expo.easeInOut",
    })
    // .to(this.group.children[0].rotation, {
    //   y: '+=6',
    //   z: '+=10',
    //   duration: 1.2,
    //   ease: "Expo.easeInOut",
    // }, "<")


    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: '#section04',
        start: '10% center',
        toggleActions: 'play none none reverse',
        // markers: true,
      }
    });
    tl3.to(this.group.rotation, {
      y: radian(180),
      duration: 1.2,
      ease: "Expo.easeInOut",
    })
    // .to(this.group.children[1].rotation, {
    //   y: '+=6',
    //   z: '+=10',
    //   duration: 1.2,
    //   ease: "Expo.easeInOut",
    // }, "<")


    const tl4 = gsap.timeline({
      scrollTrigger: {
        trigger: '#section05',
        start: '10% center',
        toggleActions: 'play none none reverse',
        // markers: true,
      }
    });
    tl4.to(this.group.rotation, {
      y: radian(270),
      duration: 1.2,
      ease: "Expo.easeInOut",
    })


    const tl5 = gsap.timeline({
      scrollTrigger: {
        trigger: '#section06',
        start: 'top center',
        toggleActions: 'play none none reverse',
        // markers: true,
      }
    });
    tl5.to(this.group.position, {
      z: this.distance * 0.5,
      duration: 1.2,
      ease: "Expo.easeInOut",
    })
    .to(this.group.rotation, {
      y: radian(710),
      x: radian(15),
      duration: 1.2,
      ease: "Expo.easeInOut",
    }, "<")


    // scrubですべてのアニメーションを同期させる
    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: '.scroll',
    //     start: 'top top',
    //     end: 'bottom bottom',
    //     // markers: true,
    //     scrub: true,
    //   }
    // });
    // tl.to(this.group.rotation, { x: radian(0) })
    //   .to(this.group.rotation, { y: radian(90) })
    //   .to(this.group.rotation, { y: radian(180) })
    //   .to(this.group.rotation, { y: radian(270) })
    //   .to(this.group.position, { z: this.distance * 0.5 })
    //   .to(this.group.rotation, { y: radian(710), x: radian(15) }, "<"); 
    
    
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
      this.group.children[i].rotation.y += 0.006;
      this.group.children[i].rotation.x += 0.002;
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


