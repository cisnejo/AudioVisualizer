import styled from 'styled-components'

const Notes = styled.div`
ul{
list-style:none;
}
li{
    padding:20px 0;
}
`

function Description() {

    return (
        <Notes>
            <ul>
                <li>Since the audio data is based on the current output of volume, ajusting the volume on the audio component will have an effect on the visualizer. </li>
                <li>Adjust the "Size" slider to increase or decrease the radius of the circles. The smaller the circle, the greater the velocity.</li>
                <li>Adjust the "Rate" slider to increase or decrease the speed of the circles.</li>

            </ul>
        </Notes>
    );
}

export default Description;