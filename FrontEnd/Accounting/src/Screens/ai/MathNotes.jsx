import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';

function mathNotes() {
    //creating Refernce for Canvas to draw on
    const canvasref = useRef(null);
    //creating a state wo determine if the user is drawing
    const [isDrawing, setIsDrawing] = useState(false);
    //creating a state to reste the canvas 
    const [reset, setReset] = useState(false);
    //creating a state to change the font color
    const [color, setColor] = useState('#FFFFFF');
    //creating a state to get and set the result
    const [result, setResult] = useState({});
    //creating a state for variable dictionary like 1=y x=1...
    const [dictOfVars, setVarDic] = useState({});
    //creating a state to render the result on the textbox
    const [textValue, setTextValue] = useState("");

    //creating a function to clear the canvas by pressing a button
    function resetCanvas() {
        const canvas = canvasref.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }


    //creating a function to send data to the backend server
    const sendData = async () => {
        const canvas = canvasref.current;
        if (canvas) {
            setTextValue("Please Wait...");
            try {
                const response = await axios({
                    method: 'post',
                    url: `${import.meta.env.VITE_API_URL_AI}`,
                    data: {
                        image: canvas.toDataURL('image/png'),
                        dict_of_vars: dictOfVars,
                    }
                });

                const respon = await response.data;
                console.log(`Response: ${respon}`);

                respon.data.forEach((data) => {
                    if (data.assign === true) {
                        // dict_of_vars[resp.result] = resp.answer;
                        setVarDic({
                            ...dictOfVars,
                            [data.expr]: data.result
                        });
                    }
                });

                respon.data.forEach((data) => {
                    setTimeout(() => {
                        setResult({
                            expression: data.expr,
                            answer: data.result
                        });
                    }, 200);
                });

            }
            catch (e) { console.log(e);}
        }
    };

    //rendering results
    useEffect(() => {
        if (result) {
            // console.log(`${result.expression} = ${result.answer}`)
            setTextValue(`${result.expression} = ${result.answer}`);
        }
        else{
            setTextValue(`${result.text}`);
        }
    }, [result]);

    //creating a useEfeect hook to initilize the canvas elements
    useEffect(() => {
        const canvas = canvasref.current;
        setTextValue("");
        if (canvas) {
            canvas.add
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                //Setting brush type
                ctx.lineCap = 'round';
                //setting brush size
                ctx.lineWidth = 5;
            }

            canvas.addEventListener('mousemove', draw);

            return () => {
                canvas.removeEventListener('mousemove', draw);
            };
        }
    }, []);

    //Creating a useEffect hook to activate whenever reset is triggered
    useEffect(() => {
        if (reset) {
            resetCanvas();
            setReset(false);
            setTextValue("");
        }
    }, [reset]);

    //creating a mouse event handler to draw elements on the canvas
    const startDrawing = (e) => {
        //calling the canvas reference from the use ref
        const canvas = canvasref.current;

        const x = e.clientX;
        const y = e.clientY - canvas.offsetTop;

        if (canvas) {
            //setting up the canvas and ctx
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                //taking th drawing from the mouse
                ctx.moveTo(x, y);
                setIsDrawing(true);
            }
        }
    };

    //creating a function that stops drawing 
    const stopDrawing = () => {
        setIsDrawing(false);
    };

    function changeBrushColor(e) {
        setColor(e.target.value);
    }

    const draw = (e) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasref.current;


        const x = e.clientX;
        const y = e.clientY - canvas.offsetTop;

        if (canvas) {
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.strokeStyle = color;
                //following the mouse
                ctx.lineTo(x, y);
                //stroke to draw 
                ctx.stroke();
            }
        }
    };

    return (
        <StyledWrapper>
            <div className="width-full h-full bg-black">
                <div className="Container">
                    <button className="funcButton" id="Reset" onClick={() => setReset(true)}>Reset</button>
                    <input type="color" className="ColorPicker" onChange={changeBrushColor} value={color} />
                    <button className="funcButton" id="Calculate" onClick={sendData}>Calculate</button>
                </div>
                <div className="Container">
                    <input type="text" className="Resultbox" value={textValue} />
                </div>
                <canvas ref={canvasref} id="canvas"
                    className="absloute top-0 left-0 width-full h-full"
                    onMouseDown={startDrawing}
                    onMouseOut={stopDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw} />
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
.Background{
    width:100vw;
    height:100vh;
    
    background-color:black;

}

.Container {
    display: flex;
    flex-direction: row;
    margin: 0;
    width: 100vw;
}

.funcButton {
    width: 35vw;
    max-width: 100%;
    height: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
    padding: 15px;
    font-size: 40px;
    transition: ease 0.30s;

    background-color: #252525;
    color: white;
}

.funcButton:hover {
    background-color: black;
    color: white;
}

.ColorPicker {
    width: 35vw;
    max-width: 100%;
    height: 100px;

    border-radius: 5px;
    border-color: #2b2b2b;
}

.Resultbox {
    width: 100vw;
    max-width: 100%;
    padding: 10px;
    margin: 0;

    border: none;
    background-color: #272727;
    font-size: 16px;
    text-align: center;
    overflow: scroll;
    color:white;
}


`;

export default mathNotes