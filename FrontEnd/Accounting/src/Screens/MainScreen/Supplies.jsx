import styled from 'styled-components';
import axios from 'axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { refreshAccessToken } from '../../Tools/authService'
import {
    debounce, searchType,
    searchBy_Supplies_Types,
    getSupplies,
} from '../../Tools/BackendServices'
import Drawer from '../../Tools/Drawer'
import { units } from '../../Tools/Math';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../Tools/TableComponent"
import { BackGround, Card, InputField, Button, SearchField, TopBar } from '../../Tools/Components'

function Supplies() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [typesData, setTypesData] = useState([]);
    const [editTypesData, setEditTypesData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [suppliesData, setSuppliesData] = useState([]);
    const [supplies, setsupplies] = useState('');
    const [suppliesAdded, setSuppliesAdded] = useState('');
    const [unit, setUnit] = useState('Unit');
    const [countity, setCountity] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [sellPrice, setSellPrice] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [editSupplyId, setEditSupplyId] = useState(null);
    const [editSearchType, setEditSearchType] = useState('');
    const [editSupplyValue, setEditSupplyValue] = useState({
        supply_name: '',
        unit: '',
        countity: '',
        buy_price: '',
        sell_price: ''
    });
    const [newSupply, setNewSupply] = useState('');

    const userData = JSON.parse(localStorage.getItem('user_data'));

    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    const backToMain = () => {
        navigate("/main");
    }

    const navigatetoTypes = () => {
        navigate("/main/types");
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const searchfetchTypes = async (query = '') => {
        searchType(userData, query, setTypesData);
    };

    const debouncedFetchTypes = useCallback(debounce(searchfetchTypes, 300), []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedFetchTypes(query);
        if (query == "" || query == null) {
            setTypesData([]);
        }
    };

    const searchfetchEditTypes = async (query = '') => {
        searchType(userData, query, setEditTypesData);
    };

    const debouncedFetchEditTypes = useCallback(debounce(searchfetchEditTypes, 300), []);

    const handleSearchEditTypeChange = (event) => {
        const query = event.target.value;
        setEditSearchType(query);
        debouncedFetchEditTypes(query);
        if (query == "" || query == null) {
            setEditTypesData([]);
        }
    };

    const handleEditTypeSelect = (type) => {
        setEditSearchType(type);
        setEditTypesData([]);
    };

    const searchFetchTypesAndSupplies = async (query = '') => {
        searchBy_Supplies_Types(userData, query, setSuppliesData, setTypesData)
    };

    const debouncedFetchTypesAndSupplies = useCallback(debounce(searchFetchTypesAndSupplies, 300), []);

    const handlesuppliesSearchChange = (event) => {
        const query = event.target.value;
        setSearch(query);
        debouncedFetchTypesAndSupplies(query);
        if (query === "" || query === null) {
            setTypesData([]);
            setSuppliesData([]);
        }
    };

    const handleTypeSelect = (type) => {
        setSearchQuery(type);
        setTypesData([]);
    };

    const handleUnitSelect = (unit) => {
        setUnit(unit);
    };

    const handleKeyDown = (event) => {
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

    const handleEditTypeKeyDown = (event) => {
        if (editTypesData.length > 0) {
            if (event.key === 'ArrowDown') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % editTypesData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'ArrowUp') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex - 1 + editTypesData.length) % editTypesData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'Enter' && focusedIndex >= 0) {
                handleEditTypeSelect(editTypesData[focusedIndex].type);
            }
        }
    };

    const fetchSupplies = () => {
        getSupplies(userData, setSuppliesData);
    };

    useEffect(() => {
        fetchSupplies()
    }, []);

    const clearButton = () => {
        fetchSupplies();
    }

    const send_data = async (event) => {
        event.preventDefault();

        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/supplies/`, {
            user: userData.user_name,
            types: searchQuery,
            supplies: supplies,
            unit: unit,
            countity: countity,
            buy_price: buyPrice,
            sell_price: sellPrice,
        }, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setSuppliesAdded(`${supplies} Added Successfully`);
            setSuppliesData([...suppliesData, {
                type: searchQuery,
                supplies: supplies,
                unit: unit,
                countity: countity,
                buy_price: buyPrice,
                sell_price: sellPrice
            }])
            setSearchQuery('');
            setsupplies('');
            setUnit('');
            setCountity('');
            setBuyPrice('');
            setSellPrice('');
        }).catch(error => {
            console.error("An Error Happend Please Wait and Try Again", error);
        });
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

    const saveSupply = async (supplyId) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.put(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-supplies/`, {
                ...editSupplyValue,
                newSupply: newSupply,
                type: editSearchType,
            }, {
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuppliesData(suppliesData.map(supply =>
                supply.id === supplyId ? { ...supply, ...editSupplyValue } : supply
            ));
            setEditSupplyId(null);
            setEditSupplyValue({
                type: '',
                supply_name: '',
                unit: '',
                countity: '',
                buy_price: '',
                sell_price: ''
            });
            fetchSupplies();
        } catch (error) {
            console.error('Error saving supply', error);
            alert("An error happened while saving the supply. Please try again.");
        }
    };

    const deleteSupply = async (supplyId) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.delete(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-supplies/`, {
                data: { supply: supplyId },
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuppliesData(suppliesData.filter(supply => supply.id !== supplyId));
            fetchSupplies();
        } catch (error) {
            console.error('Error deleting supply', error);
            alert("An error happened while deleting the supply. Please try again.");
        }
    };

    return (<StyledWrapper>
        <BackGround className="Container">
            <TopBar drawerButton_Onclick={toggleDrawer(true)} backButton_Onclick={backToMain} Text="Supplies" />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            <Card className="ItemsContainer">
                <div className="Firstrow">
                    <div className="typeField">
                        <InputField
                            className="FirstrowField"
                            placeholder='Type'
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown} />
                        {typesData.length > 0 && (
                            searchQuery && <div className="dropdown" ref={dropdownRef}>
                                {typesData.map((type, index) => (
                                    <div key={index} className={`dropdown-item${index === focusedIndex ? '-focused' : ''}`} onClick={() => handleTypeSelect(type.type)}>
                                        {type.type}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <InputField className="FirstrowField" placeholder='Supply' type="text" value={supplies} onChange={(e) => setsupplies(e.target.value)} />
                </div>

                <div className="Secondrow">
                    <div className="CountityField">
                        <div className="UnitDropDown">
                            <Button className="UnitButton" onClick={handleDropdownToggle}>{unit}</Button>
                            {dropdownVisible && (<div className="dropdown"> {units.map((unit, index) => (<div key={index} className={`dropdown-item`} onClick={() => handleUnitSelect(unit)}> {unit} </div>))} </div>)}
                        </div>
                        <InputField placeholder='Countity' type="number" className="Countity" value={countity} onChange={(e) => setCountity(e.target.value)} />
                    </div>
                    <InputField placeholder='Buy Price' type="number" className="SecondrowField" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                    <InputField placeholder='Sell Price' type="number" className="SecondrowField" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
                </div>

                <div className="Thirdrow">
                    <p style={{ color: 'white' }}>{suppliesAdded}</p>
                </div>

                <div className="Fourthrow">
                    <Button onClick={send_data}>Add Supply</Button>
                </div>

            </Card>

            <SearchField onClick={clearButton} value={search} onChange={handlesuppliesSearchChange} ></SearchField>

            <Table className='Table'>
                <TableHeader className='TableHeader'>
                    <TableRow className="Tablehead">
                        <TableHead onClick={navigatetoTypes} style={{ cursor: "pointer" }}>Type</TableHead>
                        <TableHead>Supply</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Countity</TableHead>
                        <TableHead>Buy Price</TableHead>
                        <TableHead>Sell Price</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="Tablebody">
                    {suppliesData.map((supply, index) => (
                        <TableRow key={index}>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSupplyId === supply.supply_name ? (
                                    <div className='editTypeContainer'>
                                        <InputField
                                            className="Table-Input-Field"
                                            type="text"
                                            value={editSearchType}
                                            onChange={handleSearchEditTypeChange}
                                            onKeyDown={handleEditTypeKeyDown}
                                        />
                                        {editTypesData.length > 0 && (
                                            editSearchType && <div className="dropdown" ref={dropdownRef}>
                                                {editTypesData.map((type, index) => (
                                                    <div key={index} className={`dropdown-item${index === focusedIndex ? '-focused' : ''}`} onClick={() => handleEditTypeSelect(type.type)}>
                                                        {type.type}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                ) : (
                                    supply.type
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSupplyId === supply.supply_name ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={newSupply}
                                        onChange={(e) => setNewSupply(e.target.value)}
                                    />
                                ) : (
                                    supply.supply_name
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSupplyId === supply.supply_name ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editSupplyValue.unit}
                                        onChange={(e) => setEditSupplyValue({ ...editSupplyValue, unit: e.target.value })}
                                    />
                                ) : (
                                    supply.unit
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSupplyId === supply.supply_name ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editSupplyValue.countity}
                                        onChange={(e) => setEditSupplyValue({ ...editSupplyValue, countity: e.target.value })}
                                    />
                                ) : (
                                    supply.countity
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSupplyId === supply.supply_name ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editSupplyValue.buy_price}
                                        onChange={(e) => setEditSupplyValue({ ...editSupplyValue, buy_price: e.target.value })}
                                    />
                                ) : (
                                    supply.buy_price
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSupplyId === supply.supply_name ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editSupplyValue.sell_price}
                                        onChange={(e) => setEditSupplyValue({ ...editSupplyValue, sell_price: e.target.value })}
                                    />
                                ) : (
                                    supply.sell_price
                                )}
                            </TableCell>
                            <TableCell className='ButtonsCell'>
                                {editSupplyId === supply.supply_name ? (
                                    <Button className='TableButton' onClick={() => saveSupply(supply.supply_name)}>Save</Button>
                                ) : (
                                    <Button className='TableButton' onClick={() => {
                                        setNewSupply(supply.supply_name)
                                        setEditSupplyId(supply.supply_name);
                                        setEditSearchType(supply.type);
                                        setEditSupplyValue({
                                            supply_name: supply.supply_name,
                                            unit: supply.unit,
                                            countity: supply.countity,
                                            buy_price: supply.buy_price,
                                            sell_price: supply.sell_price
                                        });
                                    }}>Edit</Button>
                                )}
                                <Button className='TableButton' onClick={() => deleteSupply(supply.supply_name)}>Delete</Button>
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
        margin-top: 3em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:2em;

        padding:0.5em;

        width:43vw;
        height: 45vh;
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

.editTypeContainer{
    position:relative;
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
            padding-right:-1em;
            padding-left:1em;

            margin-left:0.5em;
        
            .Countity{
                width:6em;
            
                padding-top:0.7em;

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

            margin-top:0.5em;
            margin-left: 0.2em;       
            margin-right: 1.5em;       
        }

    }
}  
`;


export default Supplies