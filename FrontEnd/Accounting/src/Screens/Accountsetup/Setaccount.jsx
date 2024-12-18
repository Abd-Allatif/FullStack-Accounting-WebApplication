import { useState } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from "../../Tools/Loader";
import { login, refreshAccessToken } from '../../Tools/authService'
import App from '../../App'


function SetAccount() {
  const [loading, setLoading] = useState(false);

  const [budget, setBudget] = useState('');
  const [types, setTypes] = useState('');
  const [displayTypes, setDisplayTypes] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [displayCustomer, setDisplayCustomer] = useState([]);
  const [employee, setEmployees] = useState('');
  const [displayEmployee, setDisplayEmployees] = useState([]);

  const userData = JSON.parse(localStorage.getItem('user_data'));

  const navigate = useNavigate();

  const goMainScreen = () => {
    navigate("/main");
  };

  const addToList = (list, setList, value) => {
    if (value) {
      setList([...list, value]);
    }
  };

  const removeFromList = (list, setList, index) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
  };


  const refreshAndSubmit = async () => {
    try {
      // Refresh the access token
      const newAccessToken = await refreshAccessToken();

      // Send all data to the backend
      await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/setup/`, {
        issatup: true,
        budget,
        types: displayTypes,
        customers: displayCustomer,
        employees: displayEmployee,
      }, {
        headers: {
          'Authorization': `Bearer ${newAccessToken}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Setup successful!');
    } catch (error) {
      console.error('Setup failed:', error);
      alert('Setup failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitSetupData = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log('Access Token:', localStorage.getItem('access_token'));
      // Send all data to the backend
      await refreshAndSubmit();
      goMainScreen();
    } catch (error) {
      console.error('Error during submission:', error);
      setLoading(false);
      alert('Setup failed, please try again.');
    }
  };




  return (<StyledWrapper>
    <div className='Container'>
      <div className="form">
        <p id="heading">Setup Your Account</p>
        {/**/}
        <div className='InputContainer'>
          <div className="field">
            <input autoComplete="off" placeholder="Enter Your Budget (Required)" className="input-field" type="text" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>
          <div className="field">
            <input placeholder="Insert Types (Not Required)" className="input-field" type="text" value={types} onChange={(e) => setTypes(e.target.value)} />
            <button className="fieldbtn" onClick={() => addToList(displayTypes, setDisplayTypes, types)}><span style={{ color: "#A0D2AB" }}><b>+</b></span></button>
          </div>
          {/* types Inserted Display*/}
          <div className="ulfield">
            <ul>
              {displayTypes.map((item, index) => (
                <li key={index}>
                  {item}
                  <button className="listbtn" onClick={() => removeFromList(displayTypes, setDisplayTypes, index)}>x</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="field">
            <input placeholder="Insert Existing Customer Names (Not Required)" className="input-field" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <button className="fieldbtn" onClick={() => addToList(displayCustomer, setDisplayCustomer, customerName)}><span style={{ color: "#A0D2AB" }}><b>+</b></span></button>
          </div>
          {/* Customers Inserted Display*/}
          <div className="ulfield">
            <ul>
              {displayCustomer.map((item, index) => (
                <li key={index}>
                  {item}
                  <button className="listbtn" onClick={() => removeFromList(displayCustomer, setDisplayCustomer, index)}>x</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="field">
            <input placeholder="Insert Existing Employees (Not Required)" className="input-field" type="text" value={employee} onChange={(e) => setEmployees(e.target.value)} />
            <button className="fieldbtn" onClick={() => addToList(displayEmployee, setDisplayEmployees, employee)}><span style={{ color: "#A0D2AB" }}><b>+</b></span></button>
          </div>
          {/* Employees Inserted Display*/}
          <div className="ulfield">
            <ul>
              {displayEmployee.map((item, index) => (
                <li key={index}>
                  {item}
                  <button className="listbtn" onClick={() => removeFromList(displayEmployee, setDisplayEmployees, index)}>x</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="btn">
          <button className="button1" onClick={submitSetupData}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Submit&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
        </div>
        <div className="btn1">
          {/*Here goes Any button under the above buttons*/}
        </div>
        <div className='Loader'>
          {loading && <Loader width='3' height='20' animateHeight='36' />}
        </div>
      </div>
    </div>
  </StyledWrapper>);
}

const StyledWrapper = styled.div`
  .Container {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;
  --s: 37px; /* control the size */

  --c: #0000, #282828 0.5deg 119.5deg, #0000 120deg;
  --g1: conic-gradient(from 60deg at 56.25% calc(425% / 6), var(--c));
  --g2: conic-gradient(from 180deg at 43.75% calc(425% / 6), var(--c));
  --g3: conic-gradient(from -60deg at 50% calc(175% / 12), var(--c));
  background: var(--g1), var(--g1) var(--s) calc(1.73 * var(--s)), var(--g2),
    var(--g2) var(--s) calc(1.73 * var(--s)), var(--g3) var(--s) 0,
    var(--g3) 0 calc(1.73 * var(--s)) #1e1e1e;
  background-size: calc(2 * var(--s)) calc(3.46 * var(--s));
}

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 2em;
    padding-right: 2em;
    padding-bottom: 0.4em;
    background-color: #171717;
    border-radius: 25px;

    width:45vw;
    height:auto;
    transition: .4s ease-in-out;
  }

  .form:hover {
    transform: scale(1.01);
    border: 1px solid black;
  }

  .InputContainer{
    margin-top: 25px;
  }

  #heading {
    text-align: center;
    margin-top: 1em;
    color: rgb(255, 255, 255);
    font-size: 1.2em;
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    border-radius: 25px;
    padding: 0.6em;
    border: none;
    outline: none;
    color: white;
    background-color: #171717;
    margin-bottom: 15px;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);

    margin-left:5em;
    margin-right:5em;
  }

  .ulfield{
    padding-left: 5em;
    padding-right:5em;
  }

  .input-icon {
    height: 1.3em;
    width: 1.3em;
    fill: white;
  }

  .input-field {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: #d3d3d3;

    &.input-field::placeholder{
        text-align: center;
    }
  }

  .form .btn {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 1em;
  }

  .form .btn1 {
    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: row;
    margin-top: 0.5em;
  }

  .button1 {
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
  }

  .button1:hover {
    background-color: black;
    color: white;
  }

  .fieldbtn {
    padding: 0.5em;
    padding-left: 1.1em;
    padding-right: 1.1em;
    border-radius: 5px;
    margin-right: 0.5em;
    border: none;
    outline: none;
    transition: .4s ease-in-out;
    background-color: #252525;
    border-radius: 25px;
    color: white;
  }

  .listbtn{
    padding: 0.2em;
    padding-left: 0.7em;
    padding-right: 0.7em;
    border-radius: 7px;
    margin-left: 0.5em;
    border: none;
    outline: none;
    transition: .4s ease-in-out;
    background-color: #252525;
    border-radius: 25px;
    color: white; 
  }

  .fieldbtn:hover {
    background-color: black;
    color: white;
  }

  .listbtn:hover {
    background-color: red;
    color: black;
  }

  .button3 {
    margin-bottom: 3em;
    padding: 0.5em;
    padding-left: 4.5em;
    padding-right: 4.5em;
    border-radius: 5px;
    border: none;
    outline: none;
    transition: .4s ease-in-out;
    background-color: #252525;
    color: white;
  }

  ul {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;

  padding: 0;
  list-style: none;
  margin: 10px 0 10px;
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: #252525 #f5f5f5; /* For Firefox */
}

ul::-webkit-scrollbar {
  height: 8px; /* Adjust the height of the scroll bar */
}

ul::-webkit-scrollbar-track {
  background: #252525; /* Background color of the scroll bar track */
  border-radius: 10px;
}

ul::-webkit-scrollbar-thumb {
  background-color: #252525; /* Color of the scroll bar thumb */
  border-radius: 10px;
  border: 2px solid #252525; /* Space around the thumb */
}

  ul li {
    color: #f5f5f5;
    padding: 8px 12px;
    border-radius: 4px;
    margin-right: 10px;
  }


  .button3:hover {
    background-color: red;
    color: white;
  }
  
  .Loader{
    align-self: center;
  }

  @media (min-width: 768px) and (max-width: 1024px){
    .form {
      padding-left: 2em;
      padding-right: 2em;
      padding-bottom: 0.4em;

      width:80vw;
      height:55vh;

      overflow-y: auto;
  }
  }


  @media (max-width: 768px) {
    .form {
    margin: 1.3em;
    padding-left: 2em;
    padding-right: 2em;
    padding-bottom: 0.4em;

    width:75vw;
    height:80vh;

    overflow-y: auto;
  }

  .field{
    margin-left:0;
    margin-right:0;
  }

  .ulfield{
    padding-left: 1em;
    padding-right:1em;
  }
  `;

export default SetAccount;