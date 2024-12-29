import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Loader from '../../Tools/Loader'
import Drawer from '../../Tools/Drawer'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../../Tools/TableComponent"

function Employees() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const navigate = useNavigate();

    const backToMain = () => {
        navigate("/main");
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };
    return (<StyledWrapper>
        <header>
            <div className="TopBar">
                <button className='Drawerbtn' onClick={toggleDrawer(true)}>
                    <svg className="DrawerSvg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="45" viewBox="0 0 40 40" fill='white'>
                        <path d="M 4 15 A 2.0002 2.0002 0 1 0 4 19 L 44 19 A 2.0002 2.0002 0 1 0 44 15 L 4 15 z M 4 29 A 2.0002 2.0002 0 1 0 4 33 L 44 33 A 2.0002 2.0002 0 1 0 44 29 L 4 29 z"></path>
                    </svg>
                </button>
                <h2 className='userName'>Employees</h2>
                <button className='backbtn' onClick={backToMain}>Back</button>
            </div>
        </header>
        <main>
            <div className="Container">
                <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
                <div className="ItemsContainer">
                    <div className="Firstrow">
                        <div className="field">
                            <input placeholder='Name' type="text" className="input-field" />
                        </div>
                    </div>
                    <div className="Thirdrow">

                    </div>
                    <div className="Fourthrow">
                        <button className="button1">Add Employee</button>
                    </div>
                </div>
                <footer>
                    <div className='FilterContainer'>
                        <svg width="35px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#d3d3d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <input type="text" className='Search' placeholder='Search for Sell' />
                        <button className='SearchBtn'>Search</button>
                        <button className='SearchBtn'>clear</button>
                    </div>
                    <Table className='Table'>
                        <TableHeader className='TableHeader'>
                            <TableRow className="Tablehead">
                                <TableHead>Employee Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="Tablebody">

                        </TableBody>
                    </Table>
                </footer>
            </div>
        </main>
    </StyledWrapper>)
}

const StyledWrapper = styled.div`
header{
    margin-bottom:3em;
}

.Container {
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;
  --s: 37px; /* control the size */
  
  overflow-y:auto;  

  --c: #0000, #282828 0.5deg 119.5deg, #0000 120deg;
  --g1: conic-gradient(from 60deg at 56.25% calc(425% / 6), var(--c));
  --g2: conic-gradient(from 180deg at 43.75% calc(425% / 6), var(--c));
  --g3: conic-gradient(from -60deg at 50% calc(175% / 12), var(--c));
  background: var(--g1), var(--g1) var(--s) calc(1.73 * var(--s)), var(--g2),
    var(--g2) var(--s) calc(1.73 * var(--s)), var(--g3) var(--s) 0,
    var(--g3) 0 calc(1.73 * var(--s)) #1e1e1e;
  background-size: calc(2 * var(--s)) calc(3.46 * var(--s));
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

    &.TopBar:hover{
        transform: scale(1.02);
        border: 1px solid black;
    }
}

.userName{
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

    &.Drawerbtn:hover .DrawerSvg{
        transition: .4s ease;
        fill: #222222;
    }
}

.ItemsContainer{
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 0.4em;

    margin-top: 0.3em;
    margin-left: 0.5em;
    margin-right: 0.5em;

    background-color: hsla(0, 0%, 9%, 0.788);
    backdrop-filter: blur(5px);
    opacity:1;
    border-radius: 25px;

    width:35vw;
    height: 35vh;

     box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
}

.Firstrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:1em;

    padding:1em;
    height:6em;
   
}

.Secondrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-3em;

    padding:1em;
    height:6em;
}

.Thirdrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-3em;

    padding:1em;
    height:6em;
}

.Fourthrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-3em;

    padding:1em;
    height:6em;
}

.button1{
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

    &.button1:hover{
        background-color:black;
    }
}

.backbtn{
    padding: 0.5em;
    padding-left: 1.1em;
    padding-right: 1.1em;
    border-radius: 5px;

    margin-right: 2em;
    border: none;
    
    outline: none;
    
    transition: .4s ease-in-out;
    
    background-color: #252525;
    color: white;

    &.backbtn:hover{
        background-color:red;
    }
}


.field{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    
    border-radius: 25px;
    
    padding: 1em;
    padding-left:2em;
    padding-right:2em;
    
    margin-left:1em;
    margin-right:1em;

    border: none;
    outline: none;
    
    color: white;
    background-color: #171717;
    
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);


    .input-field {
        background: none;
        border: none;
        outline: none;
        width: 100%;
        color: #d3d3d3;

        font-size:15px;

        &.input-field::placeholder{
        text-align: center;
        }
  }
}

footer{
    margin-top: 2em;
    align-self:flex-end;
}

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
        padding: 0.1em;
        padding-left: 0.4em;
        padding-right: 0.4em;
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


.Table{
    width:100vw;
    height:auto;
    background:#252525;
    color:white;

    padding-left:1em;
    border-collapse: separate;
    border-spacing: 5px;
}

.TableHeader{
    background:#171717;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
    font-weight:600;
    font-size:17px;
}

.Tablebody{
    overflow-y:auto;
}

.TableCell{
    
}

@media (min-width: 768px) and (max-width: 1024px){
    .userName{
        margin-left:1em;
        text-align:start;
    }

    .ItemsContainer{
        margin-top: 1em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:1.5em;

        padding:0.5em;

        width:60vw;
        height: 40vh;
    }


    .Firstrow{
    
    margin-top:1em;
    padding:0.2em;
    height:6em;
    }
    
    .Secondrow{
        margin-top:-1em;
    }

.field{
    
    padding: 0.8em;
    
    margin-left: 0.01em;
    margin-right:0.1em;
    margin-top: 0.01em;    
    }
  }
  

@media (max-width: 768px) {
    .userName{
        margin-left:1em;
        text-align:start;
    }

    .ItemsContainer{
        margin-top: 1em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:1.5em;

        padding:0.5em;

        width:60vw;
        height: 40vh;
    }


    .Firstrow{
    
    margin-top:1em;
    padding:0.2em;
    height:6em;
    }
    
    .Secondrow{
        margin-top:-1em;
    }

.field{
    
    padding: 0.8em;
    
    margin-left: 0.01em;
    margin-right:0.1em;
    margin-top: 0.01em;    
    }
}  
`;


export default Employees