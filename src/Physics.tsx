import Matter, { Body, Vector } from 'matter-js';
import { useEffect, useRef, useState } from 'react';

import styled from 'styled-components'

const Wrapper = styled.div`
    padding-top:3rem;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;

    input{
        width:12rem;
    }
`
export const Physics = () => {
    const [boxA, setBoxA] = useState('' as any)
    // ------------states for audio------------------
    const [audioContext, setAudioContext] = useState('' as any)
    const [audio, setAudio] = useState(new Audio)
    const [audioSource, setAudioSource] = useState('' as any)
    const [analyzer, setAnalyzer] = useState('' as any)
    const phyiscsBodyRef = useRef(null) as any
    const [running, setRunning] = useState(false)
    // ---------------------------------------------    ----
    useEffect(() => {
        let tempAudioContxt: any;
        let tempAudioSource: MediaElementAudioSourceNode;
        let tempAnalyzer: AnalyserNode;
        const width = 500;
        const height = 500;
        //const canvas = canvasRef.current as HTMLCanvasElement
        const phyiscsBody = phyiscsBodyRef.current
        // ----------Engine instantiion and render handilng ------------------------------------
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Body = Matter.Body,
            World = Matter.World,
            Composite = Matter.Composite;
        // create an engine
        const engine = Engine.create();
        const renderer = Matter.Render.create({
            element: phyiscsBody,
            engine,

            options: {
                width,
                height,

            }
        });
        engine.gravity.scale = 0;

        const music_boxes: Array<any> = []
        // module aliases
        //create a renderer
        let groundHeight = 0
        const boxes = [boxA]
        // add all of the bodies to the world
        Composite.add(engine.world, boxes);
        // run the renderer

        // create runner
        const physics_audio = document.getElementById('physics-audio') as HTMLAudioElement
        setBoxA(boxA)
        setAudio(physics_audio)



        let firstTimePlaying = true
        physics_audio.src = './music/trailer-sport.mp3'
        physics_audio.addEventListener('play', () => {
            if (firstTimePlaying) {
                tempAudioContxt = audioContext as AudioContext
                tempAudioSource = audioSource as MediaElementAudioSourceNode
                tempAnalyzer = analyzer as AnalyserNode
                tempAudioContxt = new AudioContext()
                tempAudioSource = tempAudioContxt.createMediaElementSource(physics_audio);
                tempAnalyzer = tempAudioContxt.createAnalyser();

                firstTimePlaying = false
            }
        })
        Render.run(renderer);
        const runner = Runner.create();
        // run the engine
        Runner.run(runner, engine);
        // Engine Event Handlers
        Matter.Events.on(engine, 'afterUpdate', event => {

            if (!firstTimePlaying) {
                tempAudioSource.connect(tempAnalyzer);
                tempAnalyzer.connect(tempAudioContxt.destination);

                tempAnalyzer.fftSize = Math.pow(2, (4 + parseInt(document.querySelector('input')!.value)))
                const bufferLength = tempAnalyzer.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                tempAnalyzer.getByteFrequencyData(dataArray)
                const barWidth = width / bufferLength;
                const circleRadius = Math.floor(barWidth / 5)
                const canvas = renderer.element.querySelector('canvas')
                let x = 0;
                // shoot out around box
                let sideArray: number[][] = [[], [], [], []]
                dataArray.forEach((bit, index) => sideArray[index % 4].push(bit))
                const velocity_delta = -1 * 1 / (sideArray[0].length - 1)
                const sideObj = [
                    { sidenum: 1, x_start: canvas?.width! / bufferLength, y_start: circleRadius },
                    { sidenum: 2, x_start: canvas?.width! - circleRadius, y_start: canvas?.height! / bufferLength },
                    { sidenum: 3, x_start: canvas?.width! * (1 - 1 / bufferLength), y_start: canvas?.height! - circleRadius },
                    { sidenum: 4, x_start: circleRadius, y_start: canvas?.height! * (1 - 1 / bufferLength) }
                ]
                let colorIndex = 0
                sideArray.forEach((array, index) => {
                    tempAnalyzer.getByteFrequencyData(dataArray)
                    const modIndex = index % 4;
                    const newWidth = width / array.length
                    const htmlInput: HTMLInputElement = document.querySelector('#rate-slider')!
                    array.forEach((number) => {
                        let speed = parseInt(htmlInput.value) / 10000
                        number = number / 5
                        let velocity: Vector = { x: 0, y: 0 };
                        let xPosition = sideObj[modIndex].x_start!;
                        let yPosition = sideObj[modIndex].y_start!;
                        //let speed = .0025
                        if (modIndex == 0) {
                            velocity = { x: .001, y: speed }
                        }
                        if (modIndex == 1) {
                            velocity = { x: -speed, y: .001 }
                        }
                        if (modIndex == 2) {
                            velocity = { x: -.001, y: -speed }
                        }
                        if (modIndex == 3) {
                            velocity = { x: speed, y: -.001 }
                        }

                        if (number > 35) {
                            const hue = colorIndex * 20
                            const newBox = Bodies.circle(xPosition, yPosition, circleRadius);
                            const box_obj = { box: newBox, boxTime: 0 }
                            music_boxes.push(box_obj)
                            Composite.add(engine.world, newBox)
                            Body.applyForce(newBox, { x: newBox.position.x, y: newBox.position.y }, velocity)
                            if (modIndex == 0) {
                                sideObj[modIndex] = { ...sideObj[modIndex], x_start: sideObj[modIndex].x_start! + newWidth }
                            }
                            if (modIndex == 1) {
                                sideObj[modIndex] = { ...sideObj[modIndex], y_start: sideObj[modIndex].y_start! + newWidth }
                            }
                            if (modIndex == 2) {
                                sideObj[modIndex] = {
                                    ...sideObj[modIndex], x_start: sideObj[modIndex].x_start! - newWidth,
                                }
                            }
                            if (modIndex == 3) {
                                sideObj[modIndex] = { ...sideObj[modIndex], y_start: sideObj[modIndex].y_start! - newWidth }
                            }
                        }
                        colorIndex++
                    })
                })

            }

            music_boxes.forEach(box => {
                const matterBox: Matter.Body = box.box;
                box.boxTime = box.boxTime + 1
                if (matterBox.position.y > height || matterBox.position.x < 0 || matterBox.position.y < 0 || matterBox.position.x > width || box.boxTime > 50) {
                    Matter.Composite.remove(engine.world, matterBox)
                    const boxIndex = music_boxes.indexOf(box)
                    music_boxes.splice(boxIndex, 1)
                }
            })
        })
    }, [

    ])
    return (
        <Wrapper>
            <div ref={phyiscsBodyRef} id='physics-body'>
            </div>
            <audio id='physics-audio' controls ></audio>
            <label htmlFor="size">Size</label>
            <input type="range" min="1" max="3" defaultValue={1} />
            <label htmlFor="Speed">Speed</label>
            <input id='rate-slider' type="range" min="1" max="100" defaultValue={25} />
        </Wrapper >

    )
}
