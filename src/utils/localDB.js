const DB_KEYS = {
  USER_DETAILS: 'userDetails',
  EMERGENCY_CONTACT: 'emergencyContact',
  PERMISSIONS: 'permissions',
  HELMET_NAME: 'helmetName'
};

export const localDB = {
  // Save data to localStorage
  saveUserDetails: (data) => {
    localStorage.setItem(DB_KEYS.USER_DETAILS, JSON.stringify(data));
  },

  saveEmergencyContact: (data) => {
    localStorage.setItem(DB_KEYS.EMERGENCY_CONTACT, JSON.stringify(data));
  },

  savePermissions: (data) => {
    localStorage.setItem(DB_KEYS.PERMISSIONS, JSON.stringify(data));
  },

  saveHelmetName: (name) => {
    localStorage.setItem(DB_KEYS.HELMET_NAME, name);
  },

  // Get data from localStorage
  getUserDetails: () => {
    const data = localStorage.getItem(DB_KEYS.USER_DETAILS);
    return data ? JSON.parse(data) : null;
  },

  getEmergencyContact: () => {
    const data = localStorage.getItem(DB_KEYS.EMERGENCY_CONTACT);
    return data ? JSON.parse(data) : null;
  },

  getPermissions: () => {
    const data = localStorage.getItem(DB_KEYS.PERMISSIONS);
    return data ? JSON.parse(data) : {
      bluetooth: false,
      phone: false,
      sms: false
    };
  },

  getHelmetName: () => {
    return localStorage.getItem(DB_KEYS.HELMET_NAME) || "Smart Helmet X1";
  },

  // Clear all data
  clearAllData: () => {
    localStorage.removeItem(DB_KEYS.USER_DETAILS);
    localStorage.removeItem(DB_KEYS.EMERGENCY_CONTACT);
    localStorage.removeItem(DB_KEYS.PERMISSIONS);
    localStorage.removeItem(DB_KEYS.HELMET_NAME);
  }
};
