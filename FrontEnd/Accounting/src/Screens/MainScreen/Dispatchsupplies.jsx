import styled from 'styled-components';
import axios from 'axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { refreshAccessToken, logout } from '../../Tools/authService'
import {
    debounce,
    searchBy_only_Supplies, getDispatches,
    search_dispatched,
} from '../../Tools/BackendServices'
import Loader from '../../Tools/Loader'
import Drawer from '../../Tools/Drawer'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../Tools/TableComponent"
import { BackGround, Card, InputField, Button, SearchField, TopBar } from '../../Tools/Components'

function DispatchSupplies() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchSupplies, setSearchSupplies] = useState("");
    const [suppliesData, setSuppliesData] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [countity, setCountity] = useState('');
    const [buy_price, setbuy_price] = useState('');
    const [dispatch_date, setdispatch_date] = useState('');
    const [reason, setreason] = useState('');
    const [dispatchAdded, setdispatchAdded] = useState('');
    const [dispatchData, setdispatchData] = useState([{
        supply: '',
        countity: '',
        buy_price: '',
        dispatch_date: '',
        reason: '',
    }]);
    const [editDispatchID, seteditDispatchID] = useState(null);
    const [editDispatchData, seteditDispatchData] = useState({
        id: '',
        supply: '',
        countity: '',
        buy_price: '',
        dispatch_date: '',
        reason: '',
    });
    const [searchDispatched, setsearchDispatched] = useState('');

    const userData = JSON.parse(localStorage.getItem('user_data'));

    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    const backToMain = () => {
        navigate("/main");
    }

    const navigatetoSupplies = () => {
        navigate("/main/supplies");
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    }

    const searchForSupplies = async (query = '') => {
        searchBy_only_Supplies(userData, query, setSuppliesData);
    };

    const debouncedFetchSupplies = useCallback(debounce(searchForSupplies, 300), []);

    const handleSearchSupplies = (event) => {
        const query = event.target.value;
        setSearchSupplies(query);
        debouncedFetchSupplies(query);
        if (query == "" || query == null) {
            setSuppliesData([]);
        }
    };

    const handleSuppliesSelect = (supply) => {
        setSearchSupplies(supply);
        setSuppliesData([]);
    };

    const handleSuppliesKeyDown = (event) => {
        if (suppliesData.length > 0) {
            if (event.key === 'ArrowDown') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % suppliesData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'ArrowUp') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex - 1 + suppliesData.length) % suppliesData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'Enter' && focusedIndex >= 0) {
                handleSuppliesSelect(suppliesData[focusedIndex].supply_name);
            }
        }
    };

    const scrollToItem = (index) => {
        const dropdown = dropdownRef.current;
        const item = dropdown?.children[index];
        if (item) {
            const itemHeight = item.offsetHeight;
            const visibleStart = dropdown.scrollTop;
            const visibleEnd = visibleStart + dropdown.clientHeight;

            const itemStart = item.offsetTop;
            const itemEnd = itemStart + itemHeight;

            if (itemStart < visibleStart) {
                dropdown.scrollTop = itemStart;
            } else if (itemEnd > visibleEnd) {
                dropdown.scrollTop = itemEnd - dropdown.clientHeight;
            }
        }
    };

    const searchFetchDispatched = async (query = '') => {
        search_dispatched(userData, query, setdispatchData)
    };

    const debouncedFetchDispatched = useCallback(debounce(searchFetchDispatched, 300), []);

    const handleSellsSearch = (event) => {
        const query = event.target.value;
        setsearchDispatched(query);
        debouncedFetchDispatched(query);
        if (query === "" || query === null) {
            setdispatchData([]);
        }
    };

    const send_data = async (event) => {
        event.preventDefault();

        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/dispatch-supplies/`, {
            user: userData.user_name,
            supply: searchSupplies,
            countity: countity,
            buy_price: buy_price,
            dispatch_date: dispatch_date,
            reason: reason,
        }, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json',
            }
        }).then(response => {
            setdispatchAdded(`${searchSupplies} Bought Successfully`);
            setdispatchData([...dispatchData, {
                supply: searchSupplies,
                countity: countity,
                buy_price: buy_price,
                dispatch_date: dispatch_date,
                reason: reason,
            }])
            setSearchSupplies('');
            setCountity('');
            setbuy_price('');
            setdispatch_date('');
            setreason('');
            location.reload();
        }).catch(error => {
            alert("An Error Happend Please Wait and Try Again", error);
        });
    };

    const fetchDispatched = () => {
        getDispatches(userData, setdispatchData);
    };

    useEffect(() => {
        fetchDispatched();
    }, []);

    const clearButton = () => {
        fetchDispatched();
    };


    const editDispatch = async (dispatchID) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.put(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-dispatches/`, {
                ...editDispatchData,
            }, {
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            setdispatchData(dispatchData.map(dispatch =>
                dispatch.id === dispatchID ? { ...dispatch, ...editDispatchData } : dispatch
            ));
            seteditDispatchID(null);
            seteditDispatchData({
                id: '',
                supply: '',
                countity: '',
                buy_price: '',
                dispatch_date: '',
                reason: '',
            });
            fetchDispatched();
            location.reload();
        } catch (error) {
            console.error('Error saving supply', error);
            alert("An error happened while saving the supply. Please try again.");
        }
    };

    const deleteDispatch = async (dispatchID) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.delete(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-dispatches/`, {
                data: { id: dispatchID },
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setdispatchData(dispatchData.filter(dispatch => dispatch.id !== dispatchID));
            fetchDispatched();
            location.reload();
        } catch (error) {
            console.error('Error deleting supply', error);
            alert("An error happened while deleting the supply. Please try again.");
        }
    };


    return (<StyledWrapper>
        <BackGround className="Container">
            <TopBar drawerButton_Onclick={toggleDrawer(true)} backButton_Onclick={backToMain} Text="Dispatch Supplies" />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            <Card className="ItemsContainer">
                <div className="Firstrow">
                    <div className="supplyField">
                        <InputField
                            className="FirstrowField"
                            placeholder='Supply'
                            type="text"
                            value={searchSupplies}
                            onChange={handleSearchSupplies}
                            onKeyDown={handleSuppliesKeyDown} />
                        {
                            searchSupplies && <>
                                {suppliesData.length > 0 && (
                                    searchSupplies && <div className="dropdown" ref={dropdownRef}>
                                        {suppliesData.map((supply, index) => (
                                            <div key={index} className={`dropdown-item${index === focusedIndex ? '-focused' : ''}`} onClick={() => handleSuppliesSelect(supply.supply_name)}>
                                                {supply.supply_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        }
                    </div>
                </div>

                <div className="Secondrow">
                    <div className="CountityField">
                        <InputField placeholder='Countity' type="number" className="SecondrowField" value={countity} onChange={(e) => setCountity(e.target.value)} />
                    </div>
                    <InputField placeholder='Buy Price' type="number" className="SecondrowField" value={buy_price} onChange={(e) => setbuy_price(e.target.value)} />
                    <InputField placeholder='Dispatch Date' type="date" className="SecondrowField" value={dispatch_date} onChange={(e) => setdispatch_date(e.target.value)} />
                </div>

                <div className="Thirdrow">
                    <InputField placeholder="Reason" type="Text" className="ThirdrowField" value={reason} onChange={(e) => setreason(e.target.value)} />
                </div>

                <div className="ForthRow">
                    <p style={{ color: 'white' }}>{dispatchAdded}</p>
                </div>

                <div className="FifthRow">
                    <Button onClick={send_data} >Sell</Button>
                </div>
            </Card>

            <SearchField onClick={clearButton} value={searchDispatched} onChange={handleSellsSearch} ></SearchField>

            <Table className='Table'>
                <TableHeader className='TableHeader'>
                    <TableRow className="Tablehead">
                        <TableHead onClick={navigatetoSupplies} style={{ cursor: "pointer" }}>Supply</TableHead>
                        <TableHead>Countity</TableHead>
                        <TableHead>Buy Price</TableHead>
                        <TableHead>Dispatch Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="Tablebody">
                    {dispatchData.map((dispatch, index) => (
                        <TableRow key={index}>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editDispatchID === dispatch.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editDispatchData.supply}
                                        onChange={(e) => seteditDispatchData({ ...editDispatchData, supply: e.target.value })}
                                    />
                                ) : (
                                    dispatch.supply
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editDispatchID === dispatch.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editDispatchData.countity}
                                        onChange={(e) => seteditDispatchData({ ...editDispatchData, countity: e.target.value })}
                                    />
                                ) : (
                                    dispatch.countity
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editDispatchID === dispatch.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editDispatchData.buy_price}
                                        onChange={(e) => seteditDispatchData({ ...editDispatchData, buy_price: e.target.value })}
                                    />
                                ) : (
                                    dispatch.buy_price
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editDispatchID === dispatch.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="dispatch_date"
                                        value={editDispatchData.dispatch_date}
                                        onChange={(e) => seteditDispatchData({ ...editDispatchData, dispatch_date: e.target.value })}
                                    />
                                ) : (
                                    dispatch.dispatch_date
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editDispatchID === dispatch.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editDispatchData.reason}
                                        onChange={(e) => seteditDispatchData({ ...editDispatchData, reason: e.target.value })}
                                    />
                                ) : (
                                    dispatch.reason
                                )}
                            </TableCell>
                            <TableCell className='ButtonsCell'>
                                {editDispatchID === dispatch.id ? (
                                    <Button className='TableButton' onClick={() => editDispatch(dispatch.id)}>Save</Button>
                                ) : (
                                    <Button className='TableButton' onClick={() => {
                                        seteditDispatchID(dispatch.id);
                                        seteditDispatchData({
                                            id: dispatch.id,
                                            supply: dispatch.supply,
                                            countity: dispatch.countity,
                                            buy_price: dispatch.buy_price,
                                            dispatch_date: dispatch.dispatch_date,
                                            reason: dispatch.reason,
                                        });
                                    }}>Edit</Button>
                                )}
                                <Button className='TableButton' onClick={() => deleteDispatch(dispatch.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </BackGround>
    </StyledWrapper >)
}

const StyledWrapper = styled.div`
header{
    margin-bottom:3.7em;
}

.Container {
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;

  height:100vh;
}

.ItemsContainer{
        margin-top: 1em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:2em;

        padding:0.5em;

        width:43vw;
        height: 55vh;
}

.Firstrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:1em;
    padding:1em;

    height:6em;   

    .FirstrowField{
        margin-left:0.5em;
        margin-right:0.5em;
        width:16em;
    }

    .typeField{
        position: relative;
    }

    .supplyField{
        position: relative;
    }
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #252525;
    color: white;
    border: 1px solid #171717;
    border-radius: 15px;
    max-height: 150px;
    overflow-y: auto;
    z-index: 1000;
}

.dropdown-item {
    padding: 6px;
    cursor: pointer;
}

dropdown-item-focused {
    background: #444;
}

.dropdown-item:hover {
    background: #444;
}

.Secondrow{
    display:flex;
    align-items:center;
    justify-content:center;

    margin-top:-2em;

    .CountityField{
        display:flex;
        flex-direction:row;

        align-items:center;
        justify-content:center;

        padding-right:-1em;
        padding-left:1em;

        margin-left:0.5em;
        
        .Countity{
            width:8em;
            
            padding-top:0.7em;

            margin-top:0.7em;
            margin-right:1em;
            margin-left:0.3em;
        }

        .UnitDropDown{
            position: relative;
        }
    }

    .SecondrowField{
        padding-top:0.7em;

        margin-top:0.5em;
        margin-left: 0.2em;       
        margin-right: 1.5em;       
    }

}


.ForthRow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-3em;

    padding:1em;
    height:6em;
}

.FifthRow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-3em;

    padding:1em;
    height:6em;
}

.TypesCell{
    width:50%;
}

.ButtonsCell{
    display:flex;
    align-items:center;
    justify-content:center;
    padding-bottom:15px;
}

.TableButton{
    padding: 0.5em;
    padding-left: 2.1em;
    padding-right: 2.1em;
    border-radius: 5px;

    margin-right: 0.5em;
    border: none;
    
    outline: none;
    
    transition: .4s ease-in-out;
    
    background-color: #171717;
    color: white;

    &.TableButton:hover{
        background-color:red;
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

.Table{
    width:100vw;
    height:auto;
    background:#252525;
    color:white;
    border-collapse: separate;
    border-spacing: 5px;
}

.TableHeader{
    background:#171717;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
    font-weight:600;
    font-size:17px;
}

.Table-Input-Field{
    font-size:16px;
    width:150px;
    height:30px;
}

@media (min-width: 768px) and (max-width: 1024px){
    .TopBarText{
        margin-left:1em;
    }

    .ItemsContainer{
        margin-top: 3em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:2em;

        padding:0.5em;

        width:75vw;
        height: 50vh;
    }

    .Firstrow{   
        margin-top:1em;
        padding:0.5em;
        height:6em;

        .FirstrowField{
            margin-left:0.5em;
            margin-right:0.5em;
            width:15em;
        }
    }
    
    .Secondrow{
        margin-top:-1em;
    }
}
  

@media (max-width: 768px) {
    .TopBarText{
        margin-left:1.6em;
    }

    .Container{
        overflow:hidden;
    }

    .ItemsContainer{
        margin-top: 2em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:1em;

        padding:0.5em;

        width:97vw;
        height: 55vh;
    }

    .Firstrow{
        margin-top:1.2em;
        padding:0.5em;
        height:6em;

        .FirstrowField{
           
        
        }
    }

    .Secondrow{
    
        display:block;

        margin-top:-2em;

        .CountityField{
            display:flex;
            flex-direction:row;

            align-items:center;
            justify-content:center;

            padding-right:-1em;
            padding-left:1em;

            margin-left:0.5em;
        
            .Countity{
             width:8em;

             padding-top:0.7em;

             margin-top:0.7em;
             margin-right:1em;
             margin-left:0.1em;
        }
    }

    .SecondrowField{
        align-self:center;
        padding-top:0.7em;
        margin:1em;    
    }

}


.ForthRow{
    margin-top:1.5em;

    padding:1em;
    height:6em;
}

.FifthRow{
    margin-top:-5em;

    padding:1em;
    height:6em;
}
}  
`;


export default DispatchSupplies