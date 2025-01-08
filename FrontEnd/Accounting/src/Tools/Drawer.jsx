import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'
import { refreshAccessToken } from './authService'
import axios from 'axios';

function CustomDrawer({ isOpen, toggleDrawer }) {
  const [sellsFund, setSellsFund] = useState('');
  const [permanatFund, setPermanatFund] = useState('');

  const userData = JSON.parse(localStorage.getItem('user_data'));

  const fetchFunds = async () => {
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/money-funds/`, {
      headers: {
        'Authorization': `Bearer ${newAccessToken}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      setSellsFund(response.data.sells_fund);
      setPermanatFund(response.data.permanant_fund);
    }).catch(error => {
      alert("An error happened while fetching Funds. Please try again.");
    });
  }

  useEffect(() => {
    fetchFunds();
  }, [])

  const send_data = async (event) => {
    event.preventDefault();

    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    if (sellsFund != 0) {
      await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/move-sells-funds/`, {
        user: userData.user_name,
        sellsFund: sellsFund,
      }, {
        headers: {
          'Authorization': `Bearer ${newAccessToken}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        location.reload();
      }).catch(error => {
        alert("An Error Happend Please Wait and Try Again");
      });
    }
  };


  const navigate = useNavigate();

  const goCustomers = () => {
    navigate("/main/customers");
  };

  const goSellCustomers = () => {
    navigate("/main/sell-customers");
  };

  const goMoneyIncome = () => {
    navigate("/main/money-income");
  }

  const goPayments = () => {
    navigate("/main/payments");
  }

  const goTypes = () => {
    navigate("/main/types");
  }

  const goSupplies = () => {
    navigate("/main/supplies")
  }

  const goReciepts = () => {
    navigate("/main/reciepts");
  }

  const goEmployee = () => {
    navigate("/main/employees");
  }

  

  return (
    <DrawerWrapper>
      <Overlay isOpen={isOpen} onClick={toggleDrawer(false)} />
      <DrawerContent isOpen={isOpen}>
        <div className='Drawer' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <div className="BluredScreen">
            <h2 className='FundValue'>Sells Fund:</h2>
            <p className='FundValue'>{sellsFund}</p>
            <button className='SellsFundBtn' onClick={send_data}>Move to Perma Fund</button>
            <h2 className='FundValue'>Permanant Fund:</h2>
            <p className='FundValue'>{permanatFund}</p>
            <div className="PagesContainer">
              <button onClick={goCustomers} className='btn'>Customers</button>
              <button onClick={goSellCustomers} className='btn'>Sell Customer</button>
              <button onClick={goMoneyIncome} className='btn'>Money Income</button>
              <button onClick={goPayments} className='btn'>Payments</button>
              <button onClick={goTypes} className='btn'>Types</button>
              <button onClick={goSupplies} className='btn'>Supplies</button>
              <button onClick={goReciepts} className='btn'>Reciepts</button>
              <button onClick={goEmployee} className='btn'>Employees</button>
              <button className='btn'>Inventory</button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </DrawerWrapper>
  );
}

const DrawerWrapper = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  opacity: ${props => (props.isOpen ? '1' : '0')};
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease-in-out;
  z-index: 999; /* Ensure it's above other content */
`;

const DrawerContent = styled.div`
  .Drawer{
    position: fixed;
    top: 0;
    left: 0; /*Change from left to right*/
    
    height: 100%;
    width: 30vw;
    
    background-color: rgba(245, 245, 245, 0.9);
    backdrop-filter: blur(10px);

    color: white;
    
    box-shadow: -3px 0 10px rgba(0, 0, 0, 0.3);
    
    transform: translateX(${props => (props.isOpen ? '0' : '-100%')}); /* make it 100 if you want to be on the right*/
    transition: transform 0.3s ease-in-out;
    
    z-index: 1000; /* Ensure it's above the overlay */

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

  .BluredScreen{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    overflow-y:auto;

    padding: 20px;

    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(7px);
    
    opacity: 1.2;
    
    pointer-events: auto;
    
    transition: opacity 0.3s ease-in-out;
    z-index: 999; /* Ensure it's above other content */
  }

  .SellsFund{
    display:span;
  }

  .FundValue{
    font-size:25px;
  }

  .PagesContainer{
    display:flex;
    flex-direction:column;
    padding:0.5;
    margin-top:2em;
  }

  .btn{
    padding: 0.5em;
    padding-left: 1em;
    padding-right: 12em;
    border-radius: 5px 25px;

    margin-right: 0.5em;
    margin-top:1em;
    border: none;
    
    outline: none;
    
    transition: .4s ease-in-out;
    
    background-color: #252525;
    color: white;

    &.btn:hover{
        background-color:black;
    }
  }

  .SellsFundBtn{
   padding: 0.5em;
    padding-left: 1em;
    padding-right: 2em;
    border-radius: 5px 25px;

    margin-right: 0.5em;
    margin-top:1em;
    margin-bottom:1em;
    border: none;
    
    outline: none;
    
    transition: .4s ease-in-out;
    
    background-color: #252525;
    color: white;

    &.SellsFundBtn:hover{
        background-color:black;
    }
  
  }


  @media (min-width: 768px) and (max-width: 1024px){
    .Drawer{
        width:40vw;
    }

    .btn{
      padding: 0.5em;
      padding-left: 1.2em;
      padding-right: 8em;

       margin-right: 0.5em;
  
    }

  }
  

  @media (max-width:760px) {
    .Drawer{
        width:65vw;
    }

    .btn{
      padding: 0.5em;
      padding-left: 1em;
      padding-right: 1em;

       margin-right: 0.5em;
  
    }
  
}  

`;

export default CustomDrawer;
