import Matter, { Body, Vector } from 'matter-js';
import { useEffect, useRef, useState } from 'react';

export const Physics = () => {
    const [boxA, setBoxA] = useState('' as any)
    // ------------states for audio------------------
    const [audioContext, setAudioContext] = useState('' as any)
    const [audio, setAudio] = useState(new Audio)
    const [audioSource, setAudioSource] = useState('' as any)
    const [analyzer, setAnalyzer] = useState('' as any)
    const phyiscsBodyRef = useRef(null) as any
    // ---------------------------------------------    ----
    useEffect(() => {
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
                wireframes: false,
                background: 'rgb(100,100, 255)'
                //      showAngleIndicator: true
            }
        });
        engine.gravity.scale = 0;
        //const canvas = document.querySelector('canvas')!;
        //const context = canvas.getContext('2d')!
        const music_boxes: Array<any> = []
        // module aliases
        //create a renderer
        let groundHeight = 0
        const boxes = [boxA]
        // add all of the bodies to the world
        Composite.add(engine.world, boxes);
        // run the renderer
        // Render.run(render);
        // create runner
        const physics_audio = document.getElementById('physics-audio') as HTMLAudioElement
        setBoxA(boxA)
        setAudio(physics_audio)
        //  setContext(context)


        let firstTimePlaying = true
        physics_audio.src = './music/whip.mp3'
        physics_audio.addEventListener('play', () => {
            if (firstTimePlaying) {
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
                const circleRadius = Math.floor(barWidth / 5)


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
                    let colorIndex = 0;
                    sideArray.forEach((array, index) => {
                        tempAnalyzer.getByteFrequencyData(dataArray)
                        const modIndex = index % 4;
                        const newWidth = width / array.length

                        array.forEach((number) => {
                            let velocity: Vector = { x: 0, y: 0 };
                            let xPosition = sideObj[modIndex].x_start!;
                            let yPosition = sideObj[modIndex].y_start!;
                            let speed = circleRadius * .15 / number
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

                            if (number / 5 > 0) {
                                const hue = colorIndex * 20
                                const newBox = Bodies.circle(xPosition, yPosition, circleRadius, { render: { fillStyle: `hsl(${hue},100%,50%)` } });
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
                }, 10)

                tempAnalyzer.getByteFrequencyData(dataArray)
                firstTimePlaying = false
            }
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
                    const bodyARadius: number = pair.bodyA.speed
                    const bodyBRadius: number = pair.bodyB.speed
                    bodyARadius > bodyBRadius ? Matter.Composite.remove(engine.world, pair.bodyA) : Matter.Composite.remove(engine.world, pair.bodyB);
                })
            })
            // remove  matter bodies if too low on canvas
            music_boxes.forEach(box => {
                const matterBox: Matter.Body = box.box;
                box.boxTime = box.boxTime + 1
                if (matterBox.position.y > height || matterBox.position.x < 0 || matterBox.position.y < 0 || matterBox.position.x > width) {
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
