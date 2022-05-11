
import { useEffect } from 'react'
import { buffer } from 'stream/consumers';
import { SongData } from './interfaces/ISongData'
export const Song: React.FC<SongData> = ({ songName, fileName, credit }) => {
    let audioContext: AudioContext;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    useEffect(() => {
        canvas = document.getElementById('canvas') as HTMLCanvasElement
        ctx = canvas.getContext('2d')!

    }, [])


    let isPlaying = false

    let audioSource;
    let analyzer: AnalyserNode;

    const HandleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const audio = document.getElementById('audio') as HTMLAudioElement
        audio.src = `../music/${fileName}`
        //const audio = new Audio(`../music/${fileName}`);
        if (isPlaying) {
            audio.pause()
        }
        else {
            audio.play();
            audioContext = new AudioContext();
            audioSource = audioContext.createMediaElementSource(audio);
            analyzer = audioContext.createAnalyser();
            audioSource.connect(analyzer);
            analyzer.connect(audioContext.destination);
            analyzer.fftSize = 256
            const bufferLength = analyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const barWidth = canvas.width / bufferLength;
            let barHeight;
            const animate = () => {
                let x = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                analyzer.getByteFrequencyData(dataArray)
                for (let i = 0; i < bufferLength; i++) {
               
                    barHeight = dataArray[i]
                    const hue = i *3.2
                    ctx.fillStyle = `hsl(${hue},100%,50%)`;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

                    x += barWidth;
                }
                requestAnimationFrame(animate)
            }
            animate();
        }



        isPlaying = !isPlaying
        isPlaying ? e.currentTarget.innerText = 'Pause' : e.currentTarget.innerText = 'Resume'
    }

    return (
        <div>
            <p>Song Name: {songName}</p>
            <p>Credit to: {credit}</p>
            <button onClick={(e) => HandleClick(e)}> {isPlaying ? 'Pause' : 'Play Song'}</button>
        </div>
    )
}

