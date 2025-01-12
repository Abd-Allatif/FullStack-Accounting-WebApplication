import axios from 'axios';
import { refreshAccessToken } from './authService'

// Debounce function to limit the API calls
const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
        const context = this;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

const getTypes = async (userData, setTypesData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/types`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setTypesData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching types. Please try again, Or check your internet connection.");
    });
};

const searchType = async (userData, query, setTypesData) => {
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

const getSupplies = async (userData, setSuppliesData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/supplies/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setSuppliesData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching types. Please try again.");
    });
};

const searchBy_Supplies_Types = async (userData, query, setSuppliesData, setTypesData) => {
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
    });
};

const searchBy_Supplies = async (userData, query, type, setSuppliesData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-supplies/${type}/${query}`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setSuppliesData(Array.isArray(response.data.supplies) ? response.data.supplies : []);
    }).catch(error => {
    });
};
const searchBy_only_Supplies = async (userData, query, setSuppliesData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-supplies/${query}`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setSuppliesData(Array.isArray(response.data.supplies) ? response.data.supplies : []);
    }).catch(error => {
    });
};

const getReciepts = async (userData, setRecieptsData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/buy-supplies/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setRecieptsData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching types. Please try again.");
    });
};

const search_Reciepts = async (userData, query, setRecieptsData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search_reciepts/${query}`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setRecieptsData(Array.isArray(response.data.reciepts) ? response.data.reciepts : []);
    }).catch(error => {
        console.error("Error fetching reciepts or types:", error);
    });
};

const getEmployee = async (userData, setEmployeeData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/employ-employees/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setEmployeeData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching Employees. Please try again, Or check your internet connection.");
    });
};

const searchEmployee = async (userData, query, setEmployeeData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-employees/${query}`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setEmployeeData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
    });
};

const getCustomers = async (userData, setCustomerData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/manage-customers/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setCustomerData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching Employees. Please try again, Or check your internet connection.");
    });
};

const searchCustomer = async (userData, query, setCustomerData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-customers/${query}/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setCustomerData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
    });
};

const getIncome = async (userData, setIncomeData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/manage-income/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setIncomeData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching Employees. Please try again, Or check your internet connection.");
    });
};

const searchIncome = async (userData, query, setIncomeData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-income/${query}/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setIncomeData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
    });
};

const getPayment = async (userData, setPaymentData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/manage-payment/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setPaymentData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching Employees. Please try again, Or check your internet connection.");
    });
};

const searchPayment = async (userData, query, setPaymentData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-payment/${query}/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setPaymentData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
    });
};

const getCustomerSell = async (userData, setCustomerSellData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/sell-customer/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setCustomerSellData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching types. Please try again.");
    });
};

const search_CustomerSells = async (userData, query, setCustomerSellData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-customer-sell/${query}/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setCustomerSellData(Array.isArray(response.data.customerSell) ? response.data.customerSell : []);
    }).catch(error => {
        console.error("Error fetching reciepts or types:", error);
    });
};

const getSell = async (userData, setSellData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/sell-supplies/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setSellData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching types. Please try again.");
    });
};

const search_sell = async (userData, query, setSellData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-sell/${query}`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setSellData(Array.isArray(response.data.sells) ? response.data.sells : []);
    }).catch(error => {
        console.error("Error fetching reciepts or types:", error);
    });
};

const getDispatches = async (userData,setDispatchesData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/dispatch-supplies/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setDispatchesData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching types. Please try again.");
    });
};

const search_dispatched = async (userData, query, setDispatchedData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-dispatched/${query}`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setDispatchedData(Array.isArray(response.data.dispatched) ? response.data.dispatched : []);
    }).catch(error => {
        console.error("Error fetching reciepts or types:", error);
    });
};

const getInventories = async (userData,setInventoryData) => {
    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/generate-inventory/`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setInventoryData(Array.isArray(response.data) ? response.data : [])
    }).catch(error => {
        alert("An error happened while fetching types. Please try again.");
    });
};

const search_inventory = async (userData, query, setInventoryData) => {
    const newAccessToken = await refreshAccessToken();
    await axios.get(`${import.meta.env.VITE_API_URL}/${userData.user_name}/search-inventory/${query}`, {
        headers: {
            'Authorization': `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        setInventoryData(Array.isArray(response.data.dispatched) ? response.data.dispatched : []);
    }).catch(error => {
        console.error("Error fetching reciepts or types:", error);
    });
};

export {
    getTypes,
    debounce,
    searchType,
    getSupplies,
    searchBy_Supplies_Types,
    searchBy_Supplies,
    searchBy_only_Supplies,
    getReciepts,
    search_Reciepts,
    getEmployee,
    searchEmployee,
    getCustomers,
    searchCustomer,
    getIncome,
    searchIncome,
    getPayment,
    searchPayment,
    getCustomerSell,
    search_CustomerSells,
    getSell,
    search_sell,
    getDispatches,
    search_dispatched,
    getInventories,
    search_inventory,
};