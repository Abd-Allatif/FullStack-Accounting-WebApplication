import styled from 'styled-components';
import * as React from "react";
import classNames from "classnames";
import { useNavigate } from 'react-router-dom'

const BackGround = React.forwardRef(({ className, ...props }, ref) => (
    <BackGroundStyle>
        <div ref={ref}
            className={classNames("BackGround", className)}
            {...props} />
    </BackGroundStyle>
));
BackGround.displayName = "BackGround";


const Card = React.forwardRef(({ className, ...props }, ref) => (
    <CardStyle>
        <div ref={ref}
            className={classNames("Card", className)}
            {...props}
        />
    </CardStyle>
));
Card.displayName = "Card";


const InputField = React.forwardRef(({ className,
    includeSVG,
    svgWidth = 16, svgHeight = 16,
    svgColor = "currentColor", viewBox = "0 0 16 16",
    svgPath,
    stroke, strokeWidth, strokeLinecap, strokeLinejoin,
    ...props }, ref) => (
    <InputStyle>
        <div className={classNames("Field", className)}>
            {includeSVG && <svg className='Input-Icon' xmlns="http://www.w3.org/2000/svg" width={svgWidth} height={svgHeight} fill={svgColor} viewBox={viewBox}>
                <path d={svgPath} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
            </svg>}
            <input ref={ref} className="InputField" {...props} />
        </div>
    </InputStyle>
));
InputField.displayName = "InputField";


const Button = React.forwardRef(({ className, children, ...props }, ref) => (
    <ButtonStyle>
        <button ref={ref} className={classNames("Button", className)} {...props}>{children}</button>
    </ButtonStyle>
));
Button.displayName = "Button";


const SearchField = React.forwardRef(({ onClick, value, onChange }, ref) => (
    <SearchFieldStyle>
        <div className='FilterContainer'>
            <svg width="35px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#d3d3d3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input type="text" className='Search' placeholder='Search for Sell' value={value} onChange={onChange} />

            <button className='SearchBtn' onClick={onClick}>Clear</button>
        </div>
    </SearchFieldStyle>
));
SearchField.displayName = "SearchField";

const TopBar = React.forwardRef(({ drawerButton_Onclick, backButton_Onclick, Text, buttonText, ...props }, ref) => {

    const navigate = useNavigate();

    const goMathNotes = () => {
        navigate("/math-notes");
    }

    return (
        <TopBarStyle>
            <header>
                <div className="TopBar">
                    <div className="DrawerContainer">
                        <Button className='Drawerbtn' onClick={drawerButton_Onclick}>
                            <svg className="DrawerSvg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="45" viewBox="0 0 40 40" fill='white'>
                                <path d="M 4 15 A 2.0002 2.0002 0 1 0 4 19 L 44 19 A 2.0002 2.0002 0 1 0 44 15 L 4 15 z M 4 29 A 2.0002 2.0002 0 1 0 4 33 L 44 33 A 2.0002 2.0002 0 1 0 44 29 L 4 29 z"></path>
                            </svg>
                        </Button>
                        <Button className="MathNotes" onClick={goMathNotes}>
                            <svg className="MathSvg" width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none"><path d="M14.84,11.08H48.28a5,5,0,0,1,5,5V49.53a5,5,0,0,1-5,5H14.84a5,5,0,0,1-5-5V16.08A5,5,0,0,1,14.84,11.08Z" stroke-linecap="round" /><line x1="20.8" y1="18.15" x2="20.8" y2="26.5" stroke-linecap="round" /><line x1="16.63" y1="22.32" x2="24.98" y2="22.32" stroke-linecap="round" /><line x1="17.37" y1="40.37" x2="24.08" y2="47.08" stroke-linecap="round" /><line x1="17.37" y1="47.08" x2="24.08" y2="40.37" stroke-linecap="round" /><line x1="37.8" y1="22.32" x2="47.28" y2="22.32" stroke-linecap="round" /><line x1="37.74" y1="40.37" x2="47.22" y2="40.37" stroke-linecap="round" /><line x1="37.74" y1="46.22" x2="47.22" y2="46.22" stroke-linecap="round" /><line x1="31.57" y1="11.08" x2="31.57" y2="54.53" stroke-linecap="round" /><line x1="9.84" y1="32.8" x2="53.29" y2="32.8" stroke-linecap="round" /></svg>
                        </Button>
                    </div>
                    <h2 className='TopBarText'>{Text}</h2>
                    <Button className='backbtn' onClick={backButton_Onclick}>{buttonText ? buttonText : "Back"}</Button>
                </div>
            </header>
        </TopBarStyle>)
});
TopBar.displayName = "TopBar";


export {
    Card,
    InputField,
    Button,
    BackGround,
    SearchField,
    TopBar,
};

const BackGroundStyle = styled.div`
    .BackGround{
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100vw;
        height: 100vh;
        --s: 37px; /* control the size */

        overflow-y:hidden;  

        --c: #0000, #282828 0.5deg 119.5deg, #0000 120deg;
        --g1: conic-gradient(from 60deg at 56.25% calc(425% / 6), var(--c));
        --g2: conic-gradient(from 180deg at 43.75% calc(425% / 6), var(--c));
        --g3: conic-gradient(from -60deg at 50% calc(175% / 12), var(--c));
        background: var(--g1), var(--g1) var(--s) calc(1.73 * var(--s)), var(--g2),
        var(--g2) var(--s) calc(1.73 * var(--s)), var(--g3) var(--s) 0,
        var(--g3) 0 calc(1.73 * var(--s)) #1e1e1e;
        background-size: calc(2 * var(--s)) calc(3.46 * var(--s));
    }
`;

const CardStyle = styled.div`
    .Card {
        display: flex;
        flex-direction: column;
        gap: 10px;
    
        padding-left: 2em;
        padding-right: 2em;
        padding-bottom: 0.4em;
    
        background-color: #171717;
        border-radius: 25px;

        width:45vw;
        height:65vh;

        transition: .4s ease-in-out;
    }

    @media (min-width: 768px) and (max-width: 1024px){
        .Card {
            padding-left: 2em;
            padding-right: 2em;
            padding-bottom: 0.4em;

            width:80vw;
            height:55vh;

            overflow-y: auto;
        }
    }

    @media (max-width: 768px) {
        .Card {
            margin: 1.3em;
            padding-left: 2em;
            padding-right: 2em;
            padding-bottom: 0.4em;

            width:75vw;
            height:70vh;

            overflow-y: auto;
        }
    }
`;

const InputStyle = styled.div`
    .Field{
        display: flex;
        align-items: center;
        justify-content: center;
        
        border-radius: 25px;
    
        padding: 0.6em;
    
        margin-left: 4em;
        margin-right: 4em;

        border: none;
        outline: none;
    
        color: white;
        background-color: #171717;
    
        margin-bottom: 15px;
        box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
    }

    .InputField{
        background: none;
        border: none;
        outline: none;
        width: 100%;
        color: #d3d3d3;

        &.InputField::placeholder{
            text-align: center;
        }
    }

    .Input-Icon{
        height: 1.3em;
        width: 1.3em;
        fill: white;
    }

    @media (max-width: 768px) {
        .Field{
            margin-left:0;
            margin-right:0;
        }
    }
`;

const ButtonStyle = styled.div`
    .Button{
        padding: 0.5em;
        padding-left: 1.1em;
        padding-right: 1.1em;
        border-radius: 5px;

        margin-right: 0.5em;
        border: none;
    
        outline: none;
    
        transition: .4s ease-in-out;
    
        background-color: #252525;
        color: white;

        &.Button:hover{
            background-color: black;
            color: white;
        }
    }

`;

const SearchFieldStyle = styled.div`
    .FilterContainer{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5em;

        padding: 0.6em;
        padding-left: 0.5em;
    
        width:100vw;
        height:6vh;
    
        border: none;
        outline: none;
    
        color: white;
        background-color: #171717;
    
    
        box-shadow: inset 2px 5px 10px rgb(5, 5, 5);


        .Search{
            background: none;
            border: none;
            outline: none;
            width: 100%;
            color: #d3d3d3;

            padding: 0.5em;
            &.input-field::placeholder{
                text-align: center;
            }
        }

        .SearchBtn{
            padding: 0.2em;
            padding-left: 0.5em;
            padding-right: 0.5em;
            border-radius: 15px;

            margin-right: 0.5em;
            border: none;
    
            outline: none;
    
            transition: .4s ease-in-out;
    
            background-color: #252525;
            color: white;

            &.SearchBtn:hover{
                background-color: black;
            }
    }
}


@media (max-width: 768px) {
    .FilterContainer{
       
        padding-left: 0.2em;
        padding-bottom: 1.5em;
        padding-top: 1.5em;

        .Search {
            padding: 0.5em;
        }

        .SearchBtn{
            padding: 0.2em;
            padding-left: 0.5em;
            padding-right: 0.5em;
            margin-right: 0.5em;
        }
    }
}

`;

const TopBarStyle = styled.div`
    header{
        margin-bottom:3.7em;
    }

    .TopBar{
        display:flex;
        flex-direction:row;

        position:fixed;
        top:0;
        left:0;

        z-index: 1000;

        justify-content:space-between;
        align-items:center;

        background-color: #171717;
        padding-bottom: 0.2em;
        padding-top:0.01em;

        transition: .4s ease-in-out;

        width:100vw;
        height:65px;

}

.TopBarText{
    flex-grow: 1;
    color:white;
    text-align:center;
    font-size:20px;
}

.Drawerbtn{
    margin-right:1em;    
    margin-bottom:0.1em;

    padding:1em;

    border:none;
    
    background-color: transparent;

    &.Drawerbtn:hover{
        background:none;
    }

    &.Drawerbtn:hover .DrawerSvg{
        transition: .4s ease;
        fill: #222222;
    }
}

.MathNotes{
    margin-right:-6em;    
    margin-bottom:0.1em;
    margin-left:-1em;
   
    padding:1em;

    border:none;
    
    background-color: transparent;

    &.MathNotes:hover{
        background:none;
    }

    .MathSvg{
        stroke:white;
    }

    &.MathNotes:hover .MathSvg{
        transition: .4s ease;
        stroke:rgb(0, 0, 0);
    }
}

.DrawerContainer{
    display:flex;

    align-items:center;
    justify-content:center;
}

`;