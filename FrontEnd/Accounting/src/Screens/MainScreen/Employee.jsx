import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import Loader from '../../Tools/Loader'
import { refreshAccessToken } from '../../Tools/authService'
import { getEmployee, debounce,searchEmployee } from '../../Tools/BackendServices'
import Drawer from '../../Tools/Drawer'
import { BackGround, Card, InputField, Button, SearchField, TopBar } from '../../Tools/Components'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../Tools/TableComponent"

function Employee() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [employeeName, setEmployeeName] = useState('');
    const [salary, setSalary] = useState('');
    const [empDate, setEmpDate] = useState('');
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeAdded, setEmployeeAdded] = useState('');
    const [editName, setEditName] = useState('');
    const [editEmployeeID, seteditEmployeeID] = useState(null);
    const [editDate, setEditDate] = useState('');
    const [editSalary, setEditSalary] = useState('');
    const [searchQuery,setSearchQuery] = useState('');
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

    const fetchEmployees = () => {
        getEmployee(userData, setEmployeeData);
    }

    useEffect(() => {
        fetchEmployees();
    }, []);

    const searchfetchEmployee = async (query = '') => {
        searchEmployee(userData,query,setEmployeeData);
    };

    const debouncedFetchEmployee = useCallback(debounce(searchfetchEmployee, 300), []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedFetchEmployee(query);
    };

    const clear_btn = () => {
        fetchEmployees();
    }

    const send_data = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/employ-employees/`, {
            user: userData.user_name,
            emp_name: employeeName,
            salary: salary,
            emp_date: empDate,
        }, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setEmployeeAdded(`${employeeName} Employed Successfully`);
            setEmployeeData([...employeeData, { employee_name: employeeName, salary: salary, date_of_employment: empDate }]);
            setLoading(false);
            location.reload();
        }).catch(error => {
            alert("An Error Happend Please Wait and Try Again");
            setLoading(false);
        });
    };

    const editEmployee = async (employee) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.put(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-employees/`, {
                emp_name: employee,
                salary: editSalary,
                emp_date: editDate,
                new_emp: editName
            }, {
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            seteditEmployeeID(null);
            setEmployeeData([]);
            fetchEmployees();
        } catch (error) {
            console.error('Error saving supply', error);
            alert("An error happened while saving the Employee. Please try again.");
        }
    };

    const deleteEmployee = async (employee) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.delete(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-employees/`, {
                data: { employee: employee },
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setEmployeeData(employeeData.filter(employee => employee.employee_name !== editEmployeeID));
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting supply', error);
            alert("An error happened while deleting the supply. Please try again.");
        }
    };

   

    return (<StyledWrapper>
        <BackGround className="Container">
            <TopBar drawerButton_Onclick={toggleDrawer(true)} backButton_Onclick={backToMain} Text="Employees" />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            <Card className="ItemsContainer">
                <div className="Firstrow">
                    <InputField placeholder='Employee Name' type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="first-field" />
                    <InputField placeholder='Salary' type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="first-field" />
                </div>
                <div className="Secondrow">
                    <InputField placeholder='Date' type="date" value={empDate} onChange={(e) => setEmpDate(e.target.value)} className="first-field" />
                </div>

                <div className="Thirdrow">
                    <p style={{ color: 'white' }}>{employeeAdded}</p>
                </div>

                <div className="Fourthrow">
                    <Button className="AddType" onClick={send_data}>Employ</Button>
                </div>

                <div style={{ alignSelf: 'center' }}>
                    {loading && <Loader width='3' height='20' animateHeight='36' />}
                </div>
            </Card>

            <SearchField value={searchQuery} onChange={handleSearchChange} onClick={clear_btn} />

            <Table className='Table'>
                <TableHeader className='TableHeader'>
                    <TableRow className="Tablehead">
                        <TableHead>Employee</TableHead>
                        <TableHead>Employ Date</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="Tablebody">
                    {employeeData.map((employee, index) => (
                        <TableRow key={index}>
                            <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                {editEmployeeID === employee.employee_name ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                ) : (
                                    employee.employee_name
                                )}
                            </TableCell>
                            <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                {editEmployeeID === employee.employee_name ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                    />
                                ) : (
                                    employee.date_of_employment
                                )}
                            </TableCell>
                            <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                {editEmployeeID === employee.employee_name ? (
                                    <InputField
                                        className="Table-Input-Field"
                                        type="text"
                                        value={editSalary}
                                        onChange={(e) => setEditSalary(e.target.value)}
                                    />
                                ) : (
                                    employee.salary
                                )}
                            </TableCell>
                            <TableCell className='ButtonsCell'>
                                {editEmployeeID === employee.employee_name ? (
                                    <Button className='TableButton' onClick={()=> editEmployee(employee.employee_name)}>Save</Button>
                                ) : (
                                    <Button className='TableButton' onClick={() => {
                                        seteditEmployeeID(employee.employee_name);
                                        setEditName(employee.employee_name);
                                        setEditDate(employee.date_of_employment);
                                        setEditSalary(employee.salary);
                                    }}>Edit</Button>
                                )}
                                <Button className='TableButton' onClick={() => deleteEmployee(employee.employee_name)} >Delete</Button>
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
    margin-bottom:0.8em;

    padding:1em;
    height:6em;
   
    .first-field{
        margin:1em;
    }
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

    align-self:center;
    justify-self:center;

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
    font-size:18px;
    width:250px;
    height:40px;
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


export default Employee