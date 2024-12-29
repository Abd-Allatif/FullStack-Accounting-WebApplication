import './App.css'
import Login from './Screens/User/Login'
import Register from './Screens/User/Register'
import Resetpass from './Screens/User/Resertpass'
import SetAccount from './Screens/Accountsetup/Setaccount'
import MainSellScreen from './Screens/MainScreen/Mainscreen'
import Customers from './Screens/MainScreen/Customers'
import SellCustomer from './Screens/MainScreen/Sellcustomer'
import MoneyIncome from './Screens/MainScreen/Moneyincome'
import Payments from './Screens/MainScreen/Payments'
import Types from './Screens/MainScreen/Types'
import Supplies from './Screens/MainScreen/Supplies'
import Reciepts from './Screens/MainScreen/Reciepts'
import Employee from './Screens/MainScreen/Employee'

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './Tools/AuthContext';
import PrivateRoute from './Tools/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-pass" element={<Resetpass />} />
        <Route path="/setup-account" element={<PrivateRoute element={SetAccount}/>} />
        <Route path="/main" element={<PrivateRoute element={MainSellScreen} />} />
        <Route path="/main/customers" element={<PrivateRoute element={Customers} />} />
        <Route path="/main/sell-customers" element={<PrivateRoute element={SellCustomer} />} />
        <Route path="/main/money-income" element={<PrivateRoute element={MoneyIncome} />} />
        <Route path="/main/payments" element={<PrivateRoute element={Payments} />} />
        <Route path="/main/types" element={<PrivateRoute element={Types} />} />
        <Route path="/main/supplies" element={<PrivateRoute element={Supplies} />} />
        <Route path="/main/reciepts" element={<PrivateRoute element={Reciepts} />} />
        <Route path="/main/employees" element={<PrivateRoute element={Employee} />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
