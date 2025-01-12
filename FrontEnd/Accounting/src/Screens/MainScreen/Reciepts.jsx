import styled from 'styled-components';
import axios from 'axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { refreshAccessToken } from '../../Tools/authService'
import {
    debounce, searchType,
    searchBy_Supplies, getReciepts,
    search_Reciepts,
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

function Reciepts() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchTypes, setSearchtype] = useState("");
    const [typesData, setTypesData] = useState([]);
    const [searchSupplies, setSearchSupplies] = useState("");
    const [suppliesData, setSuppliesData] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [countity, setCountity] = useState('');
    const [buy_price, setBuyPrice] = useState('');
    const [sell_price, setSellPrice] = useState('');
    const [notes, setNotes] = useState('');
    const [recieptAdded, setRecieptAdded] = useState('');
    const [recieptsData, setRecieptsData] = useState([{
        type: '',
        supply: '',
        countity: '',
        buy_price: '',
        sell_price: '',
        notes: '',
    }]);
    const [editRecieptId, setEditRecieptId] = useState(null);
    const [editRecieptsData, setEditRecieptsData] = useState({
        id: '',
        type: '',
        supply: '',
        countity: '',
        buy_price: '',
        sell_price: '',
        notes: '',
    });
    const [searchTypesAndSupplies, setSearchTypesAndSupplies] = useState('');

    const userData = JSON.parse(localStorage.getItem('user_data'));

    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    const backToMain = () => {
        navigate("/main");
    }

    const navigatetoTypes = () => {
        navigate("/main/types");
    };

    const navigatetoSupplies = () => {
        navigate("/main/supplies");
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    }

    const searchForTypes = async (query = '') => {
        searchType(userData, query, setTypesData);
    };

    const debouncedFetchTypes = useCallback(debounce(searchForTypes, 300), []);

    const handleSearchtype = (event) => {
        const query = event.target.value;
        setSearchtype(query);
        debouncedFetchTypes(query);
        if (query == "" || query == null) {
            setTypesData([]);
        }
    };

    const handleTypeSelect = (type) => {
        setSearchtype(type);
        setTypesData([]);
    };

    const searchForSupplies = async (query = '', type = '') => {
        searchBy_Supplies(userData, query, type, setSuppliesData);
    };

    const debouncedFetchSupplies = useCallback(debounce(searchForSupplies, 300), []);

    const handleSearchSupplies = (event) => {
        const query = event.target.value;
        setSearchSupplies(query);
        debouncedFetchSupplies(query, searchTypes);
        if (query == "" || query == null) {
            setSuppliesData([]);
        }
    };

    const handleSuppliesSelect = (supply) => {
        setSearchSupplies(supply);
        setSuppliesData([]);
    };

    const handleTypesKeyDown = (event) => {
        if (typesData.length > 0) {
            if (event.key === 'ArrowDown') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % typesData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'ArrowUp') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex - 1 + typesData.length) % typesData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'Enter' && focusedIndex >= 0) {
                handleTypeSelect(typesData[focusedIndex].type);
            }
        }
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

    const searchFetchTypesAndSupplies = async (query = '') => {
        search_Reciepts(userData, query, setRecieptsData)
    };

    const debouncedFetchTypesAndSupplies = useCallback(debounce(searchFetchTypesAndSupplies, 300), []);

    const hanldeRecieptSearch = (event) => {
        const query = event.target.value;
        setSearchTypesAndSupplies(query);
        debouncedFetchTypesAndSupplies(query);
        if (query === "" || query === null) {
            setRecieptsData([]);
        }
    };

    const buy_Supply = async (event) => {
        event.preventDefault();

        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/buy-supplies/`, {
            user: userData.user_name,
            types: searchTypes,
            supplies: searchSupplies,
            countity: countity,
            buy_price: buy_price,
            sell_price: sell_price,
            notes: notes,
        }, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json',
            }
        }).then(response => {
            setRecieptAdded(`${searchSupplies} Bought Successfully`);
            setRecieptsData([...recieptsData, {
                type: searchTypes,
                supply: searchSupplies,
                countity: countity,
                buy_price: buy_price,
                sell_price: sell_price,
                notes: notes,
            }])
            setSearchtype('');
            setSearchSupplies('');
            setCountity('');
            setBuyPrice('');
            setSellPrice('');
            setNotes('');
            location.reload();
        }).catch(error => {
            alert("An Error Happend Please Wait and Try Again", error);
        });
    };

    const fetchReciepts = () => {
        getReciepts(userData, setRecieptsData);
    };

    useEffect(() => {
        fetchReciepts();
    }, []);

    const clearButton = () => {
        fetchReciepts();
    };


    const editReciept = async (recieptId) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.put(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-reciepts/`, {
                ...editRecieptsData,
            }, {
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            setRecieptsData(recieptsData.map(reciept =>
                reciept.id === recieptId ? { ...reciept, ...editRecieptsData } : reciept
            ));
            setEditRecieptId(null);
            setEditRecieptsData({
                type: '',
                supply: '',
                countity: '',
                buy_price: '',
                sell_price: '',
                total: '',
                date: '',
                notes: '',
            });
            fetchReciepts();
        } catch (error) {
            console.error('Error saving supply', error);
            alert("An error happened while saving the supply. Please try again.");
        }
    };

    const deleteReciept = async (recieptId) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.delete(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-reciepts/`, {
                data: { id: recieptId },
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setRecieptsData(recieptsData.filter(reciept => reciept.id !== recieptId));
            fetchReciepts();
        } catch (error) {
            console.error('Error deleting supply', error);
            alert("An error happened while deleting the supply. Please try again.");
        }
    };


    return (<StyledWrapper>
        <BackGround className="Container">
            <TopBar drawerButton_Onclick={toggleDrawer(true)} backButton_Onclick={backToMain} Text="Buy Supplies" />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            <Card className="ItemsContainer">
                <div className="Firstrow">
                    <div className="typeField">
                        <InputField
                            className="FirstrowField"
                            placeholder='Type'
                            type="text"
                            value={searchTypes}
                            onChange={handleSearchtype}
                            onKeyDown={handleTypesKeyDown}
                        />
                        {
                            searchTypes && <>
                                {typesData.length > 0 && (
                                    searchTypes && <div className="dropdown" ref={dropdownRef}>
                                        {typesData.map((type, index) => (
                                            <div key={index} className={`dropdown-item${index === focusedIndex ? '-focused' : ''}`} onClick={() => handleTypeSelect(type.type)}>
                                                {type.type}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        }
                    </div>
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
                        <InputField placeholder='Countity' type="number" className="Countity" value={countity} onChange={(e) => setCountity(e.target.value)} />
                    </div>
                    <InputField placeholder='Buy Price' type="number" className="SecondrowField" value={buy_price} onChange={(e) => setBuyPrice(e.target.value)} />
                    <InputField placeholder='Sell Price' type="number" className="SecondrowField" value={sell_price} onChange={(e) => setSellPrice(e.target.value)} />
                </div>

                <div className="Thirdrow">
                    <InputField placeholder="Notes" type="Text" className="ThirdrowField" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <div className="ForthRow">
                    <p style={{ color: 'white' }}>{recieptAdded}</p>
                </div>

                <div className="FifthRow">
                    <Button onClick={buy_Supply} >Buy</Button>
                </div>
            </Card>

            <SearchField onClick={clearButton} value={searchTypesAndSupplies} onChange={hanldeRecieptSearch} ></SearchField>

            <Table className='Table'>
                <TableHeader className='TableHeader'>
                    <TableRow className="Tablehead">
                        <TableHead onClick={navigatetoTypes} style={{ cursor: "pointer" }}>Type</TableHead>
                        <TableHead onClick={navigatetoSupplies} style={{ cursor: "pointer" }}>Supply</TableHead>
                        <TableHead>Countity</TableHead>
                        <TableHead>Buy Price</TableHead>
                        <TableHead>Sell Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="Tablebody">
                    {recieptsData.map((reciept, index) => (
                        <TableRow key={index}>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editRecieptId === reciept.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editRecieptsData.type}
                                        onChange={(e) => setEditRecieptsData({ ...editRecieptsData, type: e.target.value })}
                                    />
                                ) : (
                                    reciept.type
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editRecieptId === reciept.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editRecieptsData.supply}
                                        onChange={(e) => setEditRecieptsData({ ...editRecieptsData, supply: e.target.value })}
                                    />
                                ) : (
                                    reciept.supply
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editRecieptId === reciept.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editRecieptsData.countity}
                                        onChange={(e) => setEditRecieptsData({ ...editRecieptsData, countity: e.target.value })}
                                    />
                                ) : (
                                    reciept.countity
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editRecieptId === reciept.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editRecieptsData.buy_price}
                                        onChange={(e) => setEditRecieptsData({ ...editRecieptsData, buy_price: e.target.value })}
                                    />
                                ) : (
                                    reciept.buy_price
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editRecieptId === reciept.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editRecieptsData.sell_price}
                                        onChange={(e) => setEditRecieptsData({ ...editRecieptsData, sell_price: e.target.value })}
                                    />
                                ) : (
                                    reciept.sell_price
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {reciept.total}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {reciept.date}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editRecieptId === reciept.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editRecieptsData.notes}
                                        onChange={(e) => setEditRecieptsData({ ...editRecieptsData, notes: e.target.value })}
                                    />
                                ) : (
                                    reciept.notes
                                )}
                            </TableCell>
                            <TableCell className='ButtonsCell'>
                                {editRecieptId === reciept.id ? (
                                    <Button className='TableButton' onClick={() => editReciept(reciept.id)}>Save</Button>
                                ) : (
                                    <Button className='TableButton' onClick={() => {
                                        setEditRecieptId(reciept.id);
                                        setEditRecieptsData({
                                            id: reciept.id,
                                            type: reciept.type,
                                            supply: reciept.supply,
                                            countity: reciept.countity,
                                            buy_price: reciept.buy_price,
                                            sell_price: reciept.sell_price,
                                            notes: reciept.notes
                                        });
                                    }}>Edit</Button>
                                )}
                                <Button className='TableButton' onClick={() => deleteReciept(reciept.id)}>Delete</Button>
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
        margin-left:1em;
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

        overflow-y:auto;

        width:97vw;
        height: 60vh;
    }

    .Firstrow{
        margin-top:1.2em;
        padding:0.2em;
        height:6em;

        .FirstrowField{
            margin-left:0.5em;
            margin-right:0.5em;
            width:9em;
        }
    }

    .Secondrow{
        flex-direction:column;
        margin-top:-2em;
        margin-bottom:2em;

        .CountityField{
            padding-right:1em;
            padding-left:1em;

            margin-left:0.5em;
        
            .Countity{
                width:9em;
            
                padding-top:0.8em;

                margin-top:0.7em;
                margin-right:0.1em;
                margin-left:0.3em;
            }

            .UnitDropDown{
                position: relative;
            }
        }

        .SecondrowField{
            padding-top:0.7em;

            margin-top:0.4em;
            margin-left: 1.5em;       
            margin-right: 1.5em;       
        }

    }

    .Thirdrow{
        margin-top:-2em;
        margin-bottom:4em;
    }

    
}  
`;


export default Reciepts