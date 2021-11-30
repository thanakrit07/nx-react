/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from 'react'
import * as THREE from 'three'
// import * as dat from 'dat.gui'

export const MainPage = () => {
  useEffect(() => {
    const dat = require('dat.gui')
    const gui = new dat.GUI()
    const OrbitControls = require('three-orbit-controls')(THREE)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    //camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    )
    camera.position.set(0, 0, 100)
    camera.lookAt(0, 0, 0)

    const scene = new THREE.Scene()

    //texture
    const material = new THREE.MeshBasicMaterial({ color: '#57c4fa' })
    material.metalness = 0.7
    material.roughness = 0.2

    //object
    const geometry = new THREE.SphereGeometry(20, 32, 32)

    const square = new THREE.Mesh(geometry, material)
    console.log(square)
    scene.add(square)
    const controls = new OrbitControls(camera, renderer.domElement)
    camera.position.set(0, 20, 100)
    controls.update()

    const cubeFolder = gui.addFolder('Square')
    // cubeFolder.add(square.radius, 'radius', 0, 20)
    cubeFolder.open()
    const cameraFolder = gui.addFolder('Camera')
    cameraFolder.add(camera.position, 'z', 0, 10)
    cameraFolder.open()
    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
  }, [])
  return <div>{/* <h1>THREE JS TESTING</h1> */}</div>
}
