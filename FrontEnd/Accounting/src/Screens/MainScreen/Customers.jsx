import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import Loader from '../../Tools/Loader'
import { refreshAccessToken } from '../../Tools/authService'
import { getCustomers,debounce,searchCustomer } from '../../Tools/BackendServices'
import Drawer from '../../Tools/Drawer'
import { BackGround, Card, InputField, Button, SearchField,TopBar } from '../../Tools/Components'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../Tools/TableComponent"

function Customers() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customerData, setcustomerData] = useState([]);
    const [customer, setCustomer] = useState('');
    const [customerAdded, setcustomerAdded] = useState('');
    const [editCustomer, seteditCustomer] = useState(null);
    const [editCustomerValue, seteditCustomerValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('user_data'));

    const backToMain = () => {
        navigate("/main");
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const fetchCustomers = () => {
       getCustomers(userData,setcustomerData);
    };

    const searchfetchCustomers = async (query = '') => {
        searchCustomer(userData,query,setcustomerData);
    };

    const debouncedFetchCustomers = useCallback(debounce(searchfetchCustomers, 300), []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedFetchCustomers(query);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const send_data = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/manage-customers/`, {
            user: userData.user_name,
            customer: customer,
        }, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setcustomerAdded(`${customer} Added Successfully`);
            setcustomerData([...customerData, { customer_name: customer }]);
            setLoading(false);
            location.reload();
        }).catch(error => {
            alert("An Error Happend Please Wait and Try Again");
            setLoading(false);
        });
    };

    const clearbtnClick = () => {
        fetchCustomers();
    };

    const edit_Customer = async (customerKey) => {
        const newAccessToken = await refreshAccessToken();
        await axios.put(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-customers/`, {
            old_customer: customerKey,
            new_customer: editCustomerValue
        }, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            fetchCustomers();
            seteditCustomer(null);
            seteditCustomerValue('');
        }).catch(error => {
            alert("An Error Happened. Please Wait and Try Again.");
        });
    };

    const deleteCustomer = async (customerKey) => {
        const newAccessToken = await refreshAccessToken();
        await axios.delete(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-customers/`, {
            data: { customer: customerKey },
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            fetchCustomers();
        }).catch(error => {
            alert("An Error Happened. Please Wait and Try Again.");
        });
    };

    return (<StyledWrapper>
        <BackGround className="Container">
            <TopBar  drawerButton_Onclick={toggleDrawer(true)} backButton_Onclick={backToMain} Text="Customers"  />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            <Card className="ItemsContainer">
                <div className="Firstrow">
                    <InputField placeholder='Customer' type="text" value={customer} onChange={(e) => { setCustomer(e.target.value) }} className="input-field" />
                </div>

                <div className="Thirdrow">
                    {customerAdded && <p style={{ color: 'white' }}>{customerAdded}</p>}
                </div>

                <div className="Fourthrow">
                    <Button className="Add Customer" onClick={send_data}>Add Customer</Button>
                </div>

                <div style={{ alignSelf: 'center' }}>
                    {loading && <Loader width='3' height='20' animateHeight='36' />}
                </div>
            </Card>

            <SearchField onClick={clearbtnClick} value={searchQuery} onChange={handleSearchChange} />

            <Table className='Table'>
                <TableHeader className='TableHeader'>
                    <TableRow className="Tablehead">
                        <TableHead>Customers</TableHead>
                        <TableHead>Total Debt</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="Tablebody">
                    {customerData.map((customer, index) => (
                        <TableRow key={index}>
                            <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                {editCustomer === customer.customer_name ? (
                                    <InputField
                                        type="text"
                                        value={editCustomerValue}
                                        onChange={(e) => seteditCustomerValue(e.target.value)}
                                    />
                                ) : (
                                    customer.customer_name
                                )}
                            </TableCell>
                            <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                    {customer.total_debt}
                            </TableCell>
                            <TableCell className='ButtonsCell'>
                                {editCustomer === customer.customer_name ? (
                                    <Button className='TableButton' onClick={() => edit_Customer(customer.customer_name)}>Save</Button>
                                ) : (
                                    <Button className='TableButton' onClick={() => {
                                        seteditCustomer(customer.customer_name);
                                        seteditCustomerValue(customer.customer_name);
                                    }}>Edit</Button>
                                )}
                                <Button className='TableButton' onClick={() => deleteCustomer(customer.customer_name)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </BackGround>
    </StyledWrapper>)
}

const StyledWrapper = styled.div`


.Container {
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;

  height:100vh;
}

.ItemsContainer{
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 0.4em;

    margin-top: 5em;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 5em;

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

.TypesCell{
    width:50%;
}

.ButtonsCell{
    display:flex;
    align-items:center;
    justify-content:center;
    padding-bottom:18px;
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

@media (min-width: 768px) and (max-width: 1024px){
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

        width:60vw;
        height: 35vh;
    }


    .Firstrow{
        margin-top:1em;
        padding:0.2em;
        height:6em;
    }
    
    .Secondrow{
        margin-top:-1em;
    }
}  
`;


export default Customers