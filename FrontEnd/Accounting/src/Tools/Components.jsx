import styled from 'styled-components';
import * as React from "react";
import classNames from "classnames";


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


const SearchField = React.forwardRef(({ className, onClick, value, onChange, ...props }, ref) => (
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

export {
    Card,
    InputField,
    Button,
    BackGround,
    SearchField,
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
    padding-left: 1.5em;
    
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

`;