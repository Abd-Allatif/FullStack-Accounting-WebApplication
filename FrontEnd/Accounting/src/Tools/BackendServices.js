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

const getSupplies = async (userData,setSuppliesData) => {
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

const searchBy_Supplies= async (userData, query,type, setSuppliesData) => {
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

const getUnit = async (userData, data, setUnit) => {
    try {
        const newAccessToken = await refreshAccessToken();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${userData.user_name}/${data}/getUnit/`, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        });
        setUnit(response.data.unit);
    } catch (error) {
        console.error("Error fetching unit:", error);
    }
};


export {
    getTypes,
    debounce,
    searchType,
    getSupplies,
    searchBy_Supplies_Types,
    searchBy_Supplies,
    getUnit,
};