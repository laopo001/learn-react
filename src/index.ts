/**
 * @author dadigua
 */
/// <reference path="../dist/babylon.d.ts" />

import { CreateParticle, showAxis } from './lib';

let canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
let engine = new BABYLON.Engine(canvas);

// This creates a basic Babylon Scene object (non-mesh)
let scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0., 0., 0., 1.);  // 初始化颜色
scene.debugLayer.show();
// scene.fogMode = BABYLON.Scene.FOGMODE_EXP;   //雾
// scene.fogDensity = 0.1;
// // scene.fogStart = 20.0;
// // scene.fogEnd = 60.0;
// scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
showAxis(scene, 15);
let fountain = BABYLON.Mesh.CreateSphere('foutain', 1.0, 0.01, scene);
fountain.position = new BABYLON.Vector3(0, 0, 8);
CreateParticle(fountain, scene);

let camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.setPosition(new BABYLON.Vector3(0, 0, -25));

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
let light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

let plane = BABYLON.Mesh.CreatePlane('plane', 10.0, scene, false, BABYLON.Mesh.DOUBLESIDE);

let dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 100, scene, true);
dynamicTexture.hasAlpha = true;
dynamicTexture.drawText('XSS平台', 5, 75, 'bold 20px Arial', '#FFFFFF', 'transparent', true);

// let StandardMaterial = new BABYLON.StandardMaterial('TextPlaneMaterial', scene);
// StandardMaterial.backFaceCulling = false;
// StandardMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
// StandardMaterial.diffuseTexture = dynamicTexture;
let ShaderMaterial = new BABYLON.ShaderMaterial('plane1', scene, './shader/basename', {});
// ShaderMaterial=ShaderMaterial.setMatrix('view', scene.getViewMatrix())
ShaderMaterial = ShaderMaterial.setTexture('textureSampler', dynamicTexture);
ShaderMaterial.setFloat('time', 0.);
plane.material = ShaderMaterial;
// plane.material.backFaceCulling=true

let time = 0;
engine.runRenderLoop(() => {
  if (ShaderMaterial && time < 1) {
    ShaderMaterial.setFloat('time', time);
    time += 0.01;

  }
  scene.render();
});

window.addEventListener('resize', () => {
  engine.resize();
});
