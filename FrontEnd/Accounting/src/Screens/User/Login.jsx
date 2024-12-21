import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Loader from '../../Tools/Loader'
import {BackGround,Card,InputField,Button} from '../../Tools/Components'
import { login } from '../../Tools/authService'

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData,setUserData] = useState({});

  useEffect(() => {
    const user = localStorage.getItem('issatup');
    setUserData(user);
  },[])

  const navigate = useNavigate();

  function goRegisterPage() {
    navigate('/register')
  }

  function goResetPage() {
    navigate('/reset-pass')
  }

  function goSetupAccount() {
    navigate("/setup-account")
  }

  function goMainScreen() {
    navigate("/main");
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitData = async (event) => {
    event.preventDefault();

    setLoading(true);
    if (password == null) {
      window.alert('Password Must Not be Empty')
      setLoading(false);
      return;
    }
    // Check if email is valid 
    else if (!isValidEmail(identifier) && identifier.includes('@')) {
      window.alert('Password Does not Match')
      setLoading(false)
      return;
    }
    else {
      try {
        await login(identifier, password);
        window.alert('Login Successful');
        setLoading(false);
        try {
          if (userData) {
            goMainScreen();
          }
          else {
            goSetupAccount();
          }
        } catch (error) {
          window.alert("Couldn't Get Your Data Please Register Or Refresh The Page");
        }
      }
      catch (error) {
        window.alert('Invalid Credentials');
        setLoading(false);
      }
    }
  }

  return (<>
    <StyledWrapper>
      <BackGround>
        <Card>
          <p id="heading">Login</p>
          
          <div className='InputContainer'>
            <InputField autoComplete="off" 
            includeSVG svgPath="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" 
            placeholder="Email or User Name" type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value.toLowerCase())}/>
            <InputField placeholder="Password" 
            includeSVG svgPath="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <div className="ButtonContainer">
            <Button className="Login" onClick={submitData}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
            <Button className="SignUp" onClick={goRegisterPage}>Sign Up</Button>
          </div>
          
          <div className="ButtonContainer2">
            <Button className="ForgotPassword" onClick={goResetPage}>Forgot Password</Button>
          </div>
          
          <div className='Loader'>
            {loading && <Loader width='3' height='20' animateHeight='36' />}
          </div>
        </Card>
      </BackGround>
    </StyledWrapper>
  </>)
}

const StyledWrapper = styled.div`
  .InputContainer{
    margin-top: 25px;
  }

  #heading {
    text-align: center;
    margin: 2em;
    color: rgb(255, 255, 255);
    font-size: 1.2em;
  }

  .ButtonContainer {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 2.7em;
  }

  .ButtonContainer2 {
    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: row;
    margin-top: 0.5em;
  }

  .SignUp {
    padding: 0.5em;
    padding-left: 2.3em;
    padding-right: 2.3em;
    
    border-radius: 5px;
    border: none;
    
    outline: none;
    transition: .4s ease-in-out;
    
    background-color: #252525;
    color: white;
  }

  .ForgotPassword {
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
    
    &.ForgotPassword:hover {
      background: red;
      color: white;
    }
  }
  
  .Loader{
    align-self: center;
  }

  @media (max-width: 768px) {
      .ButtonContainer {
        margin-top: 2.7em;
        padding-left:0.3em;
        padding-right:0.3em;
      }
  

      .ButtonContainer2 {
        margin-top: 0.5em;
      }   
        
      .SignUp {
        padding-left: 1em;
        padding-right: 1em;
      }

      .Login{
        padding-left:0.7em;
        padding-right:0.7em;
      }

      .ForgotPassword {
        margin-bottom: 1em;
        padding-left: 2.9em;
        padding-right: 2.9em;
      }
  }

  `;


export default Login;