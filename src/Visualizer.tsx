import { useRef, useEffect, useState } from "react"
import { Song } from './Song';
import musicList from './music'
export const Visualizer = () => {



    return (
        <div className='visualizer'>
            <canvas id='canvas' height='1000px' width='1000px' />
            <audio id='audio' controls></audio>
            {musicList.map(song => {
                
                return <Song  key={song.id} id={song.id} songName={song.songName} fileName={song.fileName} credit={song.credit} />
            })
            }
        </div>
    )
}