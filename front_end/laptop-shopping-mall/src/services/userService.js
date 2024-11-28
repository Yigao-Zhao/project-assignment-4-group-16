const API_BASE_URL = 'http://localhost:5005/api/user';

export const fetchUsers =async()=>{
    const token = localStorage.getItem('token'); 
    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
        method:'GET',
        headers: {
            Authorization:`Bearer ${token}`,
        },
    });

    if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users.');
    }

    return await response.json(); 
};

export const getUserInfo = async (userId) => {
	const token = localStorage.getItem('token'); 
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
		Authorization:`Bearer ${token}`,},
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    return data;
};


export const updateUserInfo = async (user) => {
  const API_BASE_URL = 'http://localhost:5005/api/user'; // Replace with your API base URL
  const token = localStorage.getItem('token'); // Fetch the auth token

  if (!token) {
    throw new Error('No token found. Please log in.');
  }
  var userId = user.UserID

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT', // Use PUT or PATCH depending on your API specification
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user), // Convert user object to JSON
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user info.');
  }

  return data; // Return the updated user data
};