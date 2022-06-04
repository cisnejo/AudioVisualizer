import matchers from '@testing-library/jest-dom/matchers';
import { getEventListeners } from 'events';
import Matter, { Body, Vector } from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import { isJsxElement, JsxElement } from 'typescript';



export const Physics = () => {
    const [boxA, setBoxA] = useState('' as any)
    const [yForce, setYForce] = useState(0 as number)
    const [xForce, setXForce] = useState(0 as number)
    // ------------states for audio------------------
    const [contextLoaded, setContextLoaded] = useState(false)
    const [audioContext, setAudioContext] = useState('' as any)
    const [audio, setAudio] = useState(new Audio)
    const [initialLoad, setInitialLoad] = useState(true)
    const [audioSource, setAudioSource] = useState('' as any)
    const [analyzer, setAnalyzer] = useState('' as any)
    const [context, setContext] = useState('' as any)
    const [currentSong, setCurrentSong] = useState('')
    //const canvasRef = useRef<HTMLCanvasElement>(null)
    const phyiscsBodyRef = useRef(null) as any

    // ---------------------------------------------    ----
    useEffect(() => {
        const width = 1100;
        const height = 700;
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
                wireframes: false,
                background: 'rgb(100,100, 255)'
                //      showAngleIndicator: true
            }
        });
        engine.gravity.scale = 0;

        var attractiveBody = Matter.Bodies.circle(100, 100, 10, {
            plugin: {
                attractors: [
                    function (bodyA: Matter.Body, bodyB: Matter.Body) {

                        return {

                            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                            y: (bodyA.position.y - bodyB.position.y) * 1e-6,
                        };
                    }
                ]
            }
        }
        );

        Composite.add(engine.world, attractiveBody)
        //const canvas = document.querySelector('canvas')!;
        //const context = canvas.getContext('2d')!
        const music_boxes: Array<any> = []



        // module aliases

        //create a renderer


        let groundHeight = 0
        let floor_y = height - groundHeight
        const boxes = [boxA]

        // add all of the bodies to the world
        Composite.add(engine.world, boxes);

        // run the renderer
        // Render.run(render);

        // create runner

        const physics_audio = document.getElementById('physics-audio') as HTMLAudioElement
        setBoxA(boxA)
        //  setContext(context)
        setAudio(physics_audio)

        const AddBox = (e: MouseEvent) => {
            const mouse_x = e.offsetX;
            const mouse_y = e.offsetY;
            const newBox = Bodies.rectangle(mouse_x, mouse_y, 10, 10);
            Composite.add(engine.world, newBox)
        }
        //canvas.addEventListener('click', (e) => AddBox(e))
        //---------------------------------

        //---------------------------------
        physics_audio.src = './music/whip.mp3'
        physics_audio.addEventListener('play', () => {
            let tempAudioContxt = audioContext as AudioContext
            let tempAudioSource = audioSource as MediaElementAudioSourceNode
            let tempAnalyzer = analyzer as AnalyserNode
            tempAudioContxt = new AudioContext()
            tempAudioSource = tempAudioContxt.createMediaElementSource(physics_audio);
            tempAnalyzer = tempAudioContxt.createAnalyser();
            tempAudioSource.connect(tempAnalyzer);
            tempAnalyzer.connect(tempAudioContxt.destination);
            tempAnalyzer.fftSize = 32
            const bufferLength = tempAnalyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const barWidth = width / bufferLength;
            let barHeight;

            const circleRadius = Math.floor(barWidth / 2.5) / 3


            const canvas = renderer.element.querySelector('canvas')
            setInterval(() => {
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

                sideArray.forEach((array, index) => {
                    tempAnalyzer.getByteFrequencyData(dataArray)
                    const modIndex = index % 4;

                    // let x_velocity = .5

                    const newWidth = width / array.length

                    array.forEach(number => {
                        let velocity: Vector = { x: 0, y: 0 };
                        let xPosition = sideObj[modIndex].x_start!;
                        let yPosition = sideObj[modIndex].y_start!;
                        let speed = .01
                        if (modIndex == 0) {
                            velocity = { x: 0, y: speed }
                        }
                        if (modIndex == 1) {
                            velocity = { x: -speed, y: 0 }
                        }
                        if (modIndex == 2) {
                            velocity = { x: 0, y: -speed }
                        }
                        if (modIndex == 3) {
                            velocity = { x: speed, y: 0 }
                        }

                        if (number / 5 > 40) {
                            const newBox = Bodies.circle(xPosition, yPosition, circleRadius, { render: { fillStyle: 'black' } });
                            const box_obj = { box: newBox, boxTime: 0 }
                            music_boxes.push(box_obj)
                            Composite.add(engine.world, newBox)
                            Body.applyForce(newBox, { x: newBox.position.x, y: newBox.position.y }, velocity)
                            //const hue = i * 3.2
                            //context.fillStyle = `hsl(${hue},100%,50%)`;
                            //context.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

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

                            //x_velocity += velocity_delta
                        }
                    })
                })

                // for (let i = 0; i < bufferLength; i++) {


                //     tempAnalyzer.getByteFrequencyData(dataArray)
                //     barHeight = dataArray[i] / 5


                //     //const circleRadius = dataArray[i] 
                //     if (barHeight > 40) {
                //         const newBox = Bodies.circle(x + circleRadius, floor_y - 20, circleRadius, { render: { fillStyle: 'black' } });
                //         const box_obj = { box: newBox, boxTime: 0 }
                //         music_boxes.push(box_obj)
                //         Composite.add(engine.world, newBox)
                //         Body.applyForce(newBox, { x: newBox.position.x, y: newBox.position.y }, { x: 0, y: -1 * dataArray[i] / 1000 })
                //         //const hue = i * 3.2
                //         //context.fillStyle = `hsl(${hue},100%,50%)`;
                //         //context.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
                //         x += barWidth;
                //     }

                // }
            }, 10)

            tempAnalyzer.getByteFrequencyData(dataArray)

        })

        Render.run(renderer);
        const runner = Runner.create();
        // run the engine
        Runner.run(runner, engine);


        // Engine Event Handlers

        Matter.Events.on(engine, 'afterUpdate', event => {
            // if two objecs collide, remove one of them
            Matter.Events.on(engine, "collisionActive", (e) => {
                e.pairs.forEach(pair => {
                    //console.log(pair.bodyA.circleRadius)
                    const bodyARadius: number = pair.bodyA.circleRadius!
                    const bodyBRadius: number = pair.bodyB.circleRadius!

                    bodyARadius > bodyBRadius && pair.bodyA !== attractiveBody && pair.bodyB !== attractiveBody ? Matter.Composite.remove(engine.world, pair.bodyA) : Matter.Composite.remove(engine.world, pair.bodyB);


                })
            })

            // remove  matter bodies if too low on canvas
            music_boxes.forEach(box => {
                const matterBox: Matter.Body = box.box;
                box.boxTime = box.boxTime + 1
                if (matterBox.position.y > height) {
                    Matter.Composite.remove(engine.world, matterBox)
                    const boxIndex = music_boxes.indexOf(box)
                    music_boxes.splice(boxIndex, 1)
                }
            })
        })
    }, [

    ])


    return (
        <div>
            <div ref={phyiscsBodyRef} id='physics-body'>
            </div>
            <audio id='physics-audio' controls ></audio>

        </div >

    )
}