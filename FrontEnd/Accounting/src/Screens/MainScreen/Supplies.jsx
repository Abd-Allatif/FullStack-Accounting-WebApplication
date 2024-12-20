import styled from 'styled-components';
import axios from 'axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { login, refreshAccessToken } from '../../Tools/authService'
import Loader from '../../Tools/Loader'
import Types from './Types';
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
import { BackGround, Card, InputField, Button, SearchField } from '../../Tools/Components'

// Debounce function to limit the API calls
const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

function Supplies() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [typesData, setTypesData] = useState([]);
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
    const [editSupplyValue, setEditSupplyValue] = useState({
        type: '',
        supply_name: '',
        unit: '',
        countity: '',
        buy_price: '',
        sell_price: ''
    });
    const [newSupply, setNewSupply] = useState('');

    const units = ['Kgram', 'gram', 'Peace']

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
        const newAccessToken = await refreshAccessToken();
        await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/${query}`, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setTypesData(Array.isArray(response.data) ? response.data : [])
        }).catch(error => {
        });
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

    const searchFetchTypesAndSupplies = async (query = '') => {
        const newAccessToken = await refreshAccessToken();
        await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search/${query}`, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setSuppliesData(Array.isArray(response.data.supplies) ? response.data.supplies : []);
            setTypesData(Array.isArray(response.data.types) ? response.data.types : []);
        }).catch(error => {
            console.error("Error fetching types and supplies", error);
        });
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


    const fetchSupplies = async () => {
        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/supplies/`, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setSuppliesData(Array.isArray(response.data) ? response.data : [])
            console.log(response.data);
        }).catch(error => {
            alert("An error happened while fetching types. Please try again.");
        });
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
            <header>
                <div className="TopBar">
                    <Button className='Drawerbtn' onClick={toggleDrawer(true)}>
                        <svg className="DrawerSvg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="45" viewBox="0 0 40 40" fill='white'>
                            <path d="M 4 15 A 2.0002 2.0002 0 1 0 4 19 L 44 19 A 2.0002 2.0002 0 1 0 44 15 L 4 15 z M 4 29 A 2.0002 2.0002 0 1 0 4 33 L 44 33 A 2.0002 2.0002 0 1 0 44 29 L 4 29 z"></path>
                        </svg>
                    </Button>
                    <h2 className='TopBarText'>Supplies</h2>
                    <Button className='backbtn' onClick={backToMain}>Back</Button>
                </div>
            </header>
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
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editSupplyValue.type}
                                        onChange={(e) => setEditSupplyValue({ ...editSupplyValue, type: e.target.value })}
                                    />
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
                                        setEditSupplyValue({
                                            type: supply.type,
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
    </StyledWrapper>)
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
        width:17em;
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
    height:20px;
}



@media (min-width: 768px) and (max-width: 1024px){
    .TopBarText{
        margin-left:1em;
        text-align:start;
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
        text-align:start;
    }

    .ItemsContainer{
        margin-top: 5em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:1.5em;

        padding:0.5em;

        width:90vw;
        height: 50vh;
    }


    .Firstrow{
        margin-top:1em;
        padding:0.2em;
        height:6em;

        .FirstrowField{
            margin-left:0.5em;
            margin-right:0.5em;
            width:9em;
        }
    }
}  
`;


export default Supplies