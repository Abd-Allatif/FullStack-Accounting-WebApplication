import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import Loader from '../../Tools/Loader'
import { BackGround, Card, InputField, Button } from '../../Tools/Components'

function Resetpass() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const sendNewPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setLoading(false);
      window.alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/reset-password/`, {
        username,
        email,
        reset_code: resetCode,
        new_password: newPassword,
      });
      window.alert(response.data.message);
      setLoading(false);
      window.location.href = '/';
    } catch (error) {
      setLoading(false);
      window.alert("An Error Happend while Resetting Your Password Please try Again Later");
    }
  };


  return (
    <StyledWrapper>
      <BackGround>
        <Card className="NewCard">
          <p id="heading">Reset Password</p>
          <div className='InputContainer'>
            <InputField autoComplete="off"
              includeSVG svgPath="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"
              placeholder="User Name" type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />

            <InputField autoComplete="off"
              includeSVG viewBox="0 0 20 20" svgPath="M4 7L10.94 11.3375C11.5885 11.7428 12.4115 11.7428 13.06 11.3375L20 7M5 18H19C20.1046 18 21 17.1046 21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} />

            <InputField autoComplete="off" placeholder="Reset Code" className="input-field" type="text" value={resetCode} onChange={(e) => setResetCode(e.target.value)} />

            <InputField placeholder="New Password"
              includeSVG svgPath="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
              type="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

            <InputField placeholder="Confirm Password"
              includeSVG svgPath="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
              type="Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          
          <div className="ButtonCotainer">
            <Button className="Reset" onClick={sendNewPassword} >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reset&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>                    </div>
          <div className='Loader'>
            {loading && <Loader width='3' height='20' animateHeight='36' />}
          </div>
        </Card>
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .InputContainer{
    margin-top: 25px;
  }

  .NewCard{
    height:650px;
  }

  #heading {
    text-align: center;
    margin: 2em;
    color: rgb(255, 255, 255);
    font-size: 1.2em;
  }

  .ButtonCotainer {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 2.7em;
    margin-bottom: 1em;
  }

  .Loader{
    align-self: center;
  }

  `;

export default Resetpass