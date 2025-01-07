import styled from 'styled-components';
import axios from 'axios';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { refreshAccessToken } from '../../Tools/authService'
import {
    debounce, searchCustomer,
    searchBy_only_Supplies, getCustomerSell,search_CustomerSells
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

function SellCustomer() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchCustomers, setSearchCustomers] = useState("");
    const [customerData, setcustomerData] = useState([]);
    const [searchSupplies, setSearchSupplies] = useState("");
    const [suppliesData, setSuppliesData] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [countity, setCountity] = useState('');
    const [price, setPrice] = useState('');
    const [debt, setdebt] = useState('');
    const [paid, setPaid] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [sellCustomerAdded, setsellCustomerAdded] = useState('');
    const [sellCustomerData, setsellCustomerData] = useState([{
        customer_name: '',
        date_of_buying: '',
        supply: '',
        price: '',
        countity: '',
        total: '',
        debt: '',
        paid: '',
        notes: '',
    }]);
    const [editSellCustomerID, seteditSellCustomerID] = useState(null);
    const [editsellCustomerData, setEditsellCustomerData] = useState({
        id: '',
        customer_name: '',
        date_of_buying: '',
        supply: '',
        price: '',
        countity: '',
        total: '',
        debt: '',
        paid: '',
        notes: '',
    });
    const [searchCustomersAndSupplies, setsearchCustomersAndSupplies] = useState('');

    const userData = JSON.parse(localStorage.getItem('user_data'));

    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    const backToMain = () => {
        navigate("/main");
    }

    const navigatetoTypes = () => {
        navigate("/main/customers");
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

    const searchForCustomer = async (query = '') => {
        searchCustomer(userData, query, setcustomerData);
    };

    const debouncedFetchCustomer = useCallback(debounce(searchForCustomer, 300), []);

    const handleSearchCustomers = (event) => {
        const query = event.target.value;
        setSearchCustomers(query);
        debouncedFetchCustomer(query);
        if (query == "" || query == null) {
            setcustomerData([]);
        }
    };

    const handleCustomerSelect = (customer) => {
        setSearchCustomers(customer);
        setcustomerData([]);
    };

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

    const handleCustomerKeyDown = (event) => {
        if (customerData.length > 0) {
            if (event.key === 'ArrowDown') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % customerData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'ArrowUp') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex - 1 + customerData.length) % customerData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'Enter' && focusedIndex >= 0) {
                handleCustomerSelect(customerData[focusedIndex].customer_name);
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

    const searchForCustomerSell = async (query = '') => {
        search_CustomerSells(userData, query, setsellCustomerData);
    };

    const debouncedFetchCustomerSell = useCallback(debounce(searchForCustomerSell, 300), []);

    const handleSearchCustomersSells = (event) => {
        const query = event.target.value;
        setsearchCustomersAndSupplies(query);
        debouncedFetchCustomerSell(query);
        if (query == "" || query == null) {
            setsellCustomerData([]);
        }
    };

    const send_data = async (event) => {
        event.preventDefault();

        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/sell-customer/`, {
            user: userData.user_name,
            customer_name: searchCustomers,
            date_of_buying: date,
            supply: searchSupplies,
            price: price,
            countity: countity,
            debt: debt,
            paid: paid,
            notes: notes,
        }, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json',
            }
        }).then(response => {
            setsellCustomerAdded(`${searchSupplies} Sold Successfully`);
            setsellCustomerData([...sellCustomerData, {
                customer_name: searchCustomers,
                date_of_buying: date,
                supply: searchSupplies,
                price: price,
                countity: countity,
                debt: debt,
                paid: paid,
                notes: notes,
            }])
            setSearchCustomers('');
            setSearchSupplies('');
            setCountity('');
            setPrice('');
            setdebt('');
            setPaid('');
            setDate('');
            setNotes('');
            location.reload();
        }).catch(error => {
            alert("An Error Happend Please Wait and Try Again", error);
        });
    };

    const fetchCustomerSell = () => {
        getCustomerSell(userData, setsellCustomerData);
    };

    useEffect(() => {
        fetchCustomerSell();
    }, []);

    const clearButton = () => {
        fetchCustomerSell();
    };


    const editSellCustomer = async (customerID) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.put(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-customer-sell/`, {
                ...editsellCustomerData,
            }, {
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            setsellCustomerData(sellCustomerData.map(customer =>
                customer.id === customerID ? { ...customer, ...editsellCustomerData } : customer
            ));
            seteditSellCustomerID(null);
            setEditsellCustomerData({
                id: '',
                customer_name: '',
                date_of_buying: '',
                supply: '',
                price: '',
                countity: '',
                total: '',
                debt: '',
                paid: '',
                notes: '',
            });
            fetchCustomerSell();
        } catch (error) {
            console.error('Error saving supply', error);
            alert("An error happened while saving the supply. Please try again.");
        }
    };

    const deleteCustomerSell = async (customerID) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.delete(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-customer-sell/`, {
                data: { id: customerID },
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setsellCustomerData(sellCustomerData.filter(customer => customer.id !== customerID));
            fetchCustomerSell();
        } catch (error) {
            console.error('Error deleting supply', error);
            alert("An error happened while deleting the supply. Please try again.");
        }
    };


    return (<StyledWrapper>
        <BackGround className="Container">
            <TopBar drawerButton_Onclick={toggleDrawer(true)} backButton_Onclick={backToMain} Text="Sell Customer" />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            <Card className="ItemsContainer">
                <div className="Firstrow">
                    <div className="typeField">
                        <InputField
                            className="FirstrowField"
                            placeholder='Customer'
                            type="text"
                            value={searchCustomers}
                            onChange={handleSearchCustomers}
                            onKeyDown={handleCustomerKeyDown}
                        />
                        {
                            searchCustomers && <>
                                {customerData.length > 0 && (
                                    searchCustomers && <div className="dropdown" ref={dropdownRef}>
                                        {customerData.map((customer, index) => (
                                            <div key={index} className={`dropdown-item${index === focusedIndex ? '-focused' : ''}`} onClick={() => hancustomerSelect(customer.customer_name)}>
                                                {customer.customer_name}
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
                    <InputField placeholder='Price' type="number" className="SecondrowField" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <InputField placeholder='Debt' type="number" className="SecondrowField" value={debt} onChange={(e) => setdebt(e.target.value)} />
                </div>

                <div className="Thirdrow">
                    <InputField placeholder="Paid" type="Text" className="ThirdrowField" value={paid} onChange={(e) => setPaid(e.target.value)} />
                    <InputField placeholder="Date" type="date" className="ThirdrowField" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="Thirdrow">
                    <InputField placeholder="Notes" type="Text" className="ThirdrowField" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <div className="ForthRow">
                    <p style={{ color: 'white' }}>{sellCustomerAdded}</p>
                </div>

                <div className="FifthRow">
                    <Button onClick={send_data} >Sell Customer</Button>
                </div>
            </Card>

            <SearchField onClick={clearButton} value={searchCustomersAndSupplies} onChange={handleSearchCustomersSells} ></SearchField>

            <Table className='Table'>
                <TableHeader className='TableHeader'>
                    <TableRow className="Tablehead">
                        <TableHead onClick={navigatetoTypes} style={{ cursor: "pointer" }}>Customer</TableHead>
                        <TableHead onClick={navigatetoSupplies} style={{ cursor: "pointer" }}>Supply</TableHead>
                        <TableHead>Countity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Debt</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="Tablebody">
                    {sellCustomerData.map((customer, index) => (
                        <TableRow key={index}>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSellCustomerID === customer.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editsellCustomerData.customer_name}
                                        onChange={(e) => setEditsellCustomerData({ ...editsellCustomerData, customer_name: e.target.value })}
                                    />
                                ) : (
                                    customer.customer_name
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSellCustomerID === customer.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editsellCustomerData.supply}
                                        onChange={(e) => setEditsellCustomerData({ ...editsellCustomerData, supply: e.target.value })}
                                    />
                                ) : (
                                    customer.supply
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSellCustomerID === customer.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editsellCustomerData.countity}
                                        onChange={(e) => setEditsellCustomerData({ ...editsellCustomerData, countity: e.target.value })}
                                    />
                                ) : (
                                    customer.countity
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSellCustomerID === customer.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editsellCustomerData.price}
                                        onChange={(e) => setEditsellCustomerData({ ...editsellCustomerData, price: e.target.value })}
                                    />
                                ) : (
                                    customer.price
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {customer.total}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSellCustomerID === customer.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editsellCustomerData.debt}
                                        onChange={(e) => setEditsellCustomerData({ ...editsellCustomerData, debt: e.target.value })}
                                    />
                                ) : (
                                    customer.debt
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSellCustomerID === customer.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="number"
                                        value={editsellCustomerData.paid}
                                        onChange={(e) => setEditsellCustomerData({ ...editsellCustomerData, paid: e.target.value })}
                                    />
                                ) : (
                                    customer.paid
                                )}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {customer.date_of_buying}
                            </TableCell>
                            <TableCell className='TableCells' style={{ fontSize: '20px', padding: '10px' }}>
                                {editSellCustomerID === customer.id ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editsellCustomerData.notes}
                                        onChange={(e) => setEditsellCustomerData({ ...editsellCustomerData, notes: e.target.value })}
                                    />
                                ) : (
                                    customer.notes
                                )}
                            </TableCell>
                            <TableCell className='ButtonsCell'>
                                {editSellCustomerID === customer.id ? (
                                    <Button className='TableButton' onClick={() => editSellCustomer(customer.id)}>Save</Button>
                                ) : (
                                    <Button className='TableButton' onClick={() => {
                                        seteditSellCustomerID(customer.id);
                                        setEditsellCustomerData({
                                            id: customer.id,
                                            customer_name: customer.customer_name,
                                            date_of_buying: customer.date_of_buying,
                                            supply: customer.supply,
                                            price: customer.price,
                                            countity: customer.countity,
                                            total: customer.total,
                                            debt: customer.debt,
                                            paid: customer.paid,
                                            notes: customer.notes,
                                        });
                                    }}>Edit</Button>
                                )}
                                <Button className='TableButton' onClick={() => deleteCustomerSell(customer.id)}>Delete</Button>
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

        overflow-y:auto;
        width:43vw;
        height: 55vh;
}

.Firstrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:0.5em;
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
    
    margin-top:0.5em;

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
        padding:1em;
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
        margin-bottom:-1em;

        .CountityField{
            padding-right:1em;
            padding-left:1em;

            margin-left:0.5em;
        
            .Countity{
                width:11em;
                padding-top:0.7em;
            }
        }

        .SecondrowField{
            padding-top:0.7em;

            margin-top:0.1em;
            margin-left: 1.5em;       
            margin-right: 1.5em;       
        }

    }

    .Thirdrow{
        padding:0.1em;
    }

    .FifthRow{
        margin:1em;
    }
}  
`;


export default SellCustomer