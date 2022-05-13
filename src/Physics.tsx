import Matter, { Body } from 'matter-js';
import { useEffect, useState } from 'react';
import { isJsxElement, JsxElement } from 'typescript';


export const Physics = () => {
    const [boxA, setBoxA] = useState('' as any)
    useEffect(() => {
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Body = Matter.Body,
            World = Matter.World,
            Composite = Matter.Composite;

        // create an engine
        const engine = Engine.create();
        const canvas = document.querySelector('canvas')!;
        const context = canvas?.getContext('2d')!

        const render = () => {
            var bodies = Composite.allBodies(engine.world);
            window.requestAnimationFrame(render);

            //context.fillStyle = '0% 0% / contain rgb(20, 21, 31)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.beginPath();

            for (var i = 0; i < bodies.length; i += 1) {
                var vertices = bodies[i].vertices;

                context.moveTo(vertices[0].x, vertices[0].y);

                for (var j = 1; j < vertices.length; j += 1) {
                    context.lineTo(vertices[j].x, vertices[j].y);
                }

                context.lineTo(vertices[0].x, vertices[0].y);
            }
            context.lineWidth = 1;
            context.strokeStyle = '#999';
            context.stroke();
        }

        render()

        // module aliases


        /* create a renderer
        const render = Render.create({
            element: physicsBody as HTMLElement,
            engine: engine
        }); */

        // create two boxes and a ground
        let boxWidth = 100;
        let ground_y_start = canvas.height
        let groundHeight = 60
        let floor_y = canvas.height - groundHeight
        const boxA = Bodies.rectangle(boxWidth / 2, floor_y, boxWidth, 80);
        //const boxB = Bodies.rectangle(450, 50, 80, 80);
        const ground = Bodies.rectangle(400, 610, 810, groundHeight, { isStatic: true });
        const boxes = [boxA, ground]
        // add all of the bodies to the world
        Composite.add(engine.world, boxes);

        // run the renderer
        // Render.run(render);

        // create runner
        const runner = Runner.create();

        // run the engine
        Runner.run(runner, engine);

        /*
           render.element.addEventListener('mousedown', (e) => {
               const new_box = Bodies.rectangle(e.clientX, e.clientY, 20, 20)
               World.add(engine.world, new_box)
           })*/
        setBoxA(boxA)
    }, [

    ])

    const verticalForce = () => {
        Body.applyForce(boxA, { x: boxA.position.x, y: boxA.position.y }, { x: 0, y: -.3 })
    }

    const horizontalForce = () => {
        Body.applyForce(boxA, { x: boxA.position.x, y: boxA.position.y }, { x: .3, y:0 })
    }

    return (
        <div id='physics-body'>
            <canvas width={800} height={600} style={{ background: "0% 0% / contain rgb(20, 21, 31)" }}></canvas>
            <button onClick={() => verticalForce()}>Apply vertical force</button>
            <button onClick={() => horizontalForce()}>Apply horizontal force</button>
        </div >

    )
}