import { useRef, useEffect, useState } from "react"
import { Song } from './Song';
import musicList from './music'
export const Visualizer = () => {
    const [contextLoaded, setContextLoaded] = useState(false)
    const [audioContext, setAudioContext] = useState('' as any)
    const [audio, setAudio] = useState(new Audio)
    const [canvas, setCanvas] = useState(document.getElementById('canvas') as HTMLCanvasElement)
    const [initialLoad, setInitialLoad] = useState(true)
    const [audioSource, setAudioSource] = useState('' as any)
    const [analyzer, setAnalyzer] = useState('' as any)
    const [ctx, setCtx] = useState('' as any)

    useEffect(() => {
        setAudio(document.getElementById('audio') as HTMLAudioElement)
        setCanvas(document.getElementById('canvas') as HTMLCanvasElement)
    }, [])

    const LoadContext = () => {
        let req: number;
        audio.src = '../music/whip.mp3'
        let tempCtx = ctx as CanvasRenderingContext2D
        let tempAudioContxt = audioContext as AudioContext
        let tempAudioSource = audioSource as MediaElementAudioSourceNode
        let tempAnalyzer = analyzer as AnalyserNode

        /* Setup Audio Context and Audio Source for Node Analyzer
        / Cannot change the reference to the Audio Context or create an additional Media Element Source*/
        if (initialLoad) {
            audio.addEventListener('play', () => animate())
            tempCtx = canvas.getContext('2d')!
            tempAudioContxt = new AudioContext()
            tempAudioSource = tempAudioContxt.createMediaElementSource(audio);
            tempAnalyzer = tempAudioContxt.createAnalyser();
            tempAudioSource.connect(tempAnalyzer);
            tempAnalyzer.connect(tempAudioContxt.destination);
            tempAnalyzer.fftSize = 256
            setAnalyzer(tempAnalyzer)
            setAudioContext(tempAudioContxt)
            setAudioSource(tempAudioSource)
            setInitialLoad(false)
            setCtx(tempCtx)
        }
        else {
            tempAudioContxt.resume()
        }
        const bufferLength = tempAnalyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = canvas.width / bufferLength;
        let barHeight;

        const animate = () => {
            let x = 0;
            tempCtx.clearRect(0, 0, canvas.width, canvas.height);
            tempAnalyzer.getByteFrequencyData(dataArray)
            for (let i = 0; i < bufferLength; i++) {

                barHeight = dataArray[i]
                const hue = i * 3.2
                tempCtx.fillStyle = `hsl(${hue},100%,50%)`;
                tempCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
                x += barWidth;
            }
            req = requestAnimationFrame(animate)
        }
        setContextLoaded(true)
    }

    const UnloadContext = () => {
        audioContext.suspend()
        setContextLoaded(false)
    }

    return (
        <div className='visualizer'>
            <canvas id='canvas' height='200px' width='1000px' />
            <audio id='audio' controls></audio>
            {/* <button onClick={(e) => HandleClick(e)}> {isPlaying ? 'Pause' : 'Play Song'}</button>
           } {musicList.map(song => {
               
                //return <Song key={song.id} id={song.id} songName={song.songName} fileName={song.fileName} credit={song.credit} />
            })
            } {*/}
            {!contextLoaded ? <button onClick={() => LoadContext()}>Load Audio</button> :
                <button id='unload-context' onClick={() => UnloadContext()}>Unload Audio</button>}
        </div>
    )
}