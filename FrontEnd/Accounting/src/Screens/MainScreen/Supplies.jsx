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
    const [newSupply,setNewSupply] = useState('');

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

            await axios.delete(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-supplies/`,{
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
        <header>
            <div className="TopBar">
                <button className='Drawerbtn' onClick={toggleDrawer(true)}>
                    <svg className="DrawerSvg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="45" viewBox="0 0 40 40" fill='white'>
                        <path d="M 4 15 A 2.0002 2.0002 0 1 0 4 19 L 44 19 A 2.0002 2.0002 0 1 0 44 15 L 4 15 z M 4 29 A 2.0002 2.0002 0 1 0 4 33 L 44 33 A 2.0002 2.0002 0 1 0 44 29 L 4 29 z"></path>
                    </svg>
                </button>
                <h2 className='userName'>Supplies</h2>
                <button className='backbtn' onClick={backToMain}>Back</button>
            </div>
        </header>
        <main>
            <div className="Container">
                <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
                <div className="ItemsContainer">
                    <div className="Firstrow">
                        <div className="type-field">
                            <input
                                placeholder='Type'
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                className="input-field"
                            />
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
                        <div className="field">
                            <input placeholder='Supply' type="text" className="input-field" value={supplies} onChange={(e) => setsupplies(e.target.value)} />
                        </div>
                    </div>
                    <div className="Secondrow">
                        <div className="type-field">
                            <button className='dropdownButton' onClick={handleDropdownToggle}>{unit}</button>
                            {dropdownVisible && (<div className="dropdown"> {units.map((unit, index) => (<div key={index} className={`dropdown-item`} onClick={() => handleUnitSelect(unit)}> {unit} </div>))} </div>)}
                            <input placeholder='Countity' type="number" className="countity-input-field" value={countity} onChange={(e) => setCountity(e.target.value)} />
                        </div>
                        <div className="field">
                            <input placeholder='Buy Price' type="text" className="input-field" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
                        </div>
                        <div className="field">
                            <input placeholder='Sell Price' type="text" className="input-field" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
                        </div>
                    </div>
                    <div className="Thirdrow">
                        <p style={{ color: 'white' }}>{suppliesAdded}</p>
                    </div>
                    <div className="Fourthrow">
                        <button className="button1" onClick={send_data}>Add Supply</button>

                    </div>
                </div>
                <footer>
                    <div className='FilterContainer'>
                        <svg width="35px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#d3d3d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <input type="text" className='Search' placeholder='Search for Sell' value={search} onChange={handlesuppliesSearchChange} />
                        <button className='SearchBtn' onClick={clearButton}>clear</button>
                    </div>
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
                                    <TableCell className='SuppliesCell' style={{ fontSize: '20px', padding: '10px' }}>
                                        {editSupplyId === supply.supply_name ? (
                                            <div className="Table-field">
                                                <input
                                                    className='Table-input-field'
                                                    type="text"
                                                    value={editSupplyValue.type}
                                                    onChange={(e) => setEditSupplyValue({ ...editSupplyValue, type: e.target.value })}
                                                />
                                            </div>
                                        ) : (
                                            supply.type
                                        )}
                                    </TableCell>
                                    <TableCell className='SuppliesCell' style={{ fontSize: '20px', padding: '10px' }}>
                                        {editSupplyId === supply.supply_name ? (
                                            <div className="Table-field">
                                                <input
                                                    className='Table-input-field'
                                                    type="text"
                                                    value={newSupply}
                                                    onChange={(e) => setNewSupply(e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            supply.supply_name
                                        )}
                                    </TableCell>
                                    <TableCell className='SuppliesCell' style={{ fontSize: '20px', padding: '10px' }}>
                                        {editSupplyId === supply.supply_name ? (
                                            <div className="Table-field">
                                                <input
                                                    className='Table-input-field'
                                                    type="text"
                                                    value={editSupplyValue.unit}
                                                    onChange={(e) => setEditSupplyValue({ ...editSupplyValue, unit: e.target.value })}
                                                />
                                            </div>
                                        ) : (
                                            supply.unit
                                        )}
                                    </TableCell>
                                    <TableCell className='SuppliesCell' style={{ fontSize: '20px', padding: '10px' }}>
                                        {editSupplyId === supply.supply_name ? (
                                            <div className="Table-field">
                                                <input
                                                    className='Table-input-field'
                                                    type="number"
                                                    value={editSupplyValue.countity}
                                                    onChange={(e) => setEditSupplyValue({ ...editSupplyValue, countity: e.target.value })}
                                                />
                                            </div>
                                        ) : (
                                            supply.countity
                                        )}
                                    </TableCell>
                                    <TableCell className='SuppliesCell' style={{ fontSize: '20px', padding: '10px' }}>
                                        {editSupplyId === supply.supply_name ? (
                                            <div className="Table-field">
                                                <input
                                                    className='Table-input-field'
                                                    type="number"
                                                    value={editSupplyValue.buy_price}
                                                    onChange={(e) => setEditSupplyValue({ ...editSupplyValue, buy_price: e.target.value })}
                                                />
                                            </div>
                                        ) : (
                                            supply.buy_price
                                        )}
                                    </TableCell>
                                    <TableCell className='SuppliesCell' style={{ fontSize: '20px', padding: '10px' }}>
                                        {editSupplyId === supply.supply_name ? (
                                            <div className="Table-field">
                                                <input
                                                    className='Table-input-field'
                                                    type="number"
                                                    value={editSupplyValue.sell_price}
                                                    onChange={(e) => setEditSupplyValue({ ...editSupplyValue, sell_price: e.target.value })}
                                                />
                                            </div>
                                        ) : (
                                            supply.sell_price
                                        )}
                                    </TableCell>
                                    <TableCell className='ButtonsCell'>
                                        {editSupplyId === supply.supply_name ? (
                                            <button className='TableButton' onClick={() => saveSupply(supply.supply_name)}>Save</button>
                                        ) : (
                                            <button className='TableButton' onClick={() => {
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
                                            }}>Edit</button>
                                        )}
                                        <button className='TableButton' onClick={() => deleteSupply(supply.supply_name)}>Delete</button>
                                    </TableCell>
                                </TableRow>
                            ))}
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

.dropdownButton{
    position: relative;
    padding: 0.1em;
    padding-left: 0.5em;
    padding-right: 0.5em;
    border-radius: 10px;

    margin-right: 0.5em;
    border: none;
    
    outline: none;
    
    transition: .4s ease-in-out;
    
    background-color: #252525;
    color: white;

    &.dropdownButton:hover{
        background-color:black;
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
    padding: 8px;
    cursor: pointer;
}

dropdown-item-focused {
    background: #444;
}

.dropdown-item:hover {
    background: #444;
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
    
    padding: 2em;
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 0.4em;

    margin-top: 1.5em;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 1em;

    background-color: hsla(0, 0%, 9%, 0.788);
    backdrop-filter: blur(5px);
    opacity:1;
    border-radius: 25px;

    width:50vw;
    height: 60vh;

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
    
    margin-top:-1.9em;

    padding:1em;
    height:6em;
}

.Fourthrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-1.5em;

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
    
    padding: 0.6em;
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

        font-size:16px;

        &.input-field::placeholder{
        text-align: center;
        }
  }
}

.Table-field{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    
    border-radius: 60px;
    
    padding: 0.5em;
    padding-left:2em;
    padding-right:2em;
    
    margin-left:1em;
    margin-right:1em;

    border: none;
    outline: none;
    
    color: white;
    background-color: #171717;
    
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);

    .Table-input-field {
        background: none;
        border: none;
        outline: none;
        width: 100%;
        color: #d3d3d3;

        font-size:18px;

        &.input-field::placeholder{
        text-align: center;
        }
  }
    
}

.countity-input-field{
        background: none;
        padding-right:20px;
        border: none;
        outline: none;
        width: 100%;
        color: #d3d3d3;

        font-size:16px;

        &.input-field::placeholder{
        text-align: center;
        }
}


.type-field{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    border-radius: 25px;
    
    padding: 0.6em;
    padding-left:0.5em;
    padding-right:0.1em;
    
    margin-left:0.5em;
    margin-right:0.1em;

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

        font-size:16px;

        &.input-field::placeholder{
        text-align: center;
        }
  }


}

footer{
    width: 100vw;
    margin-top: 2em;
    align-self:flex-end;
}

.FilterContainer{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;

    padding: 0.6em;
    padding-left:1.4em;
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

    &.input-field::placeholder{
        text-align: center;
    }
    }

    .SearchBtn{
        padding: 0.2em;
        padding-left: 0.8em;
        padding-right: 0.8em;
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
    
    padding:0.5em;
    padding-left: 1em;
    border-collapse: separate;
    border-spacing: 5px;
}

.TableButton{
    padding: 0.5em;
    padding-left: 3.1em;
    padding-right: 3.1em;
    border-radius: 5px;

    margin-right: 0.5em;
    border: none;
    
    outline: none;
    
    transition: .4s ease-in-out;
    
    background-color: #252525;
    color: white;

    &.TableButton:hover{
        background-color:red;
    }
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

.SuppliesCell{
    font-size:17px;
    padding-top:12px;
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

        width:85vw;
        height: 50vh;
    }


    .Firstrow{
    
    margin-top:1em;
    padding:1em;
    height:6em;
    }
    
    .Secondrow{
        margin-top:-1em;
    }

.field{
    
    padding: 0.8em;
    
    margin-left: 0.4em;
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

        width:85vw;
        height: 50vh;
    }


    .Firstrow{
    
    margin-top:1em;
    padding:1em;
    height:6em;
    }
    
    .Secondrow{
        margin-top:-1em;
    }

.field{
    
    padding: 0.8em;
    
    margin-left: 0.4em;
    margin-right:0.1em;
    margin-top: 0.01em;    
    }

.Table-field{
    padding: 0.5em;
    padding-left:1em;
    padding-right:1em;
    
    margin-left:0.1em;
    margin-right:0.1em;

    .Table-input-field {
        font-size:15px;
        width:100%;
        width:8em;
        &.input-field::placeholder{
        text-align: center;
        }
  }
}
}  
`;


export default Supplies