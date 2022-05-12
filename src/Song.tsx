
import { useEffect } from 'react'
import { buffer } from 'stream/consumers';
import { SongData } from './interfaces/ISongData'
export const Song: React.FC<SongData> = ({ songName, fileName, credit }) => {
      /*let audioContext: AudioContext;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    useEffect(() => {
        canvas = document.getElementById('canvas') as HTMLCanvasElement
        

    }, [])



  const HandleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const audio = document.getElementById('audio') as HTMLAudioElement
        audio.src = `../music/${fileName}`
        //const audio = new Audio(`../music/${fileName}`);
        if (isPlaying) {
            audio.pause()
        }
        else {
            audio.play();
            
            
       
           



        isPlaying = !isPlaying
        isPlaying ? e.currentTarget.innerText = 'Pause' : e.currentTarget.innerText = 'Resume'
           
    }*/

    return (
        <div>
            <p>Song Name: {songName}</p>
            <p>Credit to: {credit}</p>
            {/*}<button onClick={(e) => HandleClick(e)}> {isPlaying ? 'Pause' : 'Play Song'}</button>{*/}
        </div>
    )
}

