import matchers from '@testing-library/jest-dom/matchers';
import { getEventListeners } from 'events';
import Matter, { Body } from 'matter-js';
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
        physics_audio.src = './music/trailer-sport.mp3'
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

            const circleRadius = Math.floor(barWidth / 2.5)
            console.log(bufferLength)

            let previousMaxValues = []
            setInterval(() => {
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {

                    tempAnalyzer.getByteFrequencyData(dataArray)

                    barHeight = dataArray[i] / 5

                    // shoot out around box
                    let sideArray: any = [[], [], [], []]
                    dataArray.forEach((bit, index) => sideArray[index % 4].push(bit))

                    
                    //const circleRadius = dataArray[i] 
                    if (barHeight > 40) {
                        const newBox = Bodies.circle(x + circleRadius, floor_y - 20, circleRadius, { render: { fillStyle: 'black' } });
                        const box_obj = { box: newBox, boxTime: 0 }
                        music_boxes.push(box_obj)
                        Composite.add(engine.world, newBox)
                        Body.applyForce(newBox, { x: newBox.position.x, y: newBox.position.y }, { x: 0, y: -1 * dataArray[i] / 1000 })
                        //const hue = i * 3.2
                        //context.fillStyle = `hsl(${hue},100%,50%)`;
                        //context.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
                        x += barWidth;
                    }

                }
            }, 50)

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

                    bodyARadius > bodyBRadius ? Matter.Composite.remove(engine.world, pair.bodyA) : Matter.Composite.remove(engine.world, pair.bodyB);


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