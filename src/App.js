import { useState, useEffect } from 'react';
import './App.css';
import EditDetails from './pages/EditDetails';
import { localDB } from './utils/localDB';

function Navbar({ onEditDetailsClick, theme, onThemeToggle }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1 onClick={() => onEditDetailsClick('home')}>RideAlert</h1>
      </div>
      <button onClick={onThemeToggle} className="theme-toggle">
        <span className="material-icons">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </nav>
  );
}

function PermissionModal({ title, message, onAccept, onDeny }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onDeny} className="deny-btn">Deny</button>
          <button onClick={onAccept} className="accept-btn">Accept</button>
        </div>
      </div>
    </div>
  );
}

function UserDetailsForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    address: initialData?.address || '',
    email: initialData?.email || '',
    phone: initialData?.phone || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-content">
        <h2>RideAlert</h2>  {/* Changed from "User Details" */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmergencyContactForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    emergencyName: initialData?.emergencyName || '',
    emergencyPhone: initialData?.emergencyPhone || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-content">
        <h2>RideAlert</h2>  {/* Changed from "Emergency Contact" */}
        <p className="form-subtitle">Please provide emergency contact details</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emergencyName">Emergency Contact Name</label>
            <input
              type="text"
              id="emergencyName"
              name="emergencyName"
              value={formData.emergencyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="emergencyPhone">Emergency Contact Phone</label>
            <input
              type="tel"
              id="emergencyPhone"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BluetoothPairingModal({ onClose }) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [device, setDevice] = useState(null);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError(null);

      // Request Bluetooth device without filters to see all available devices
      const bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', '0000180f-0000-1000-8000-00805f9b34fb']
      });

      setDevice(bluetoothDevice);

      // Add event listener for when device gets disconnected
      bluetoothDevice.addEventListener('gattserverdisconnected', () => {
        setDevice(null);
        setError('Device disconnected');
      });

      // Try to connect to the device
      const server = await bluetoothDevice.gatt.connect();
      console.log('Connected to GATT server:', server);

      onClose();
    } catch (err) {
      console.error('Bluetooth Error:', err);
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content bluetooth-modal">
        <h2>Bluetooth Pairing</h2>
        {error && <p className="error-message">{error}</p>}
        {device ? (
          <div className="device-info">
            <p>Connected to: {device.name}</p>
            <p>ID: {device.id}</p>
          </div>
        ) : (
          <>
            <p>Click the button below to scan for nearby RideAlert devices</p>
            <button 
              onClick={startScanning} 
              className="scan-btn"
              disabled={isScanning}
            >
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </button>
          </>
        )}
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [userDetails, setUserDetails] = useState(() => localDB.getUserDetails());
  const [emergencyContact, setEmergencyContact] = useState(() => localDB.getEmergencyContact());
  const [permissions, setPermissions] = useState(() => localDB.getPermissions());
  const [helmetName, setHelmetName] = useState(() => localDB.getHelmetName());
  const [editingHelmetName, setEditingHelmetName] = useState(false);
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showNavigationInput, setShowNavigationInput] = useState(false);
  const [destination, setDestination] = useState('');

  // Check if user has already completed setup
  const hasCompletedSetup = () => {
    return localDB.getUserDetails() !== null && 
           localDB.getEmergencyContact() !== null;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Only show permission modal if setup hasn't been completed
      if (!hasCompletedSetup()) {
        setCurrentPermission('bluetooth');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const requestBluetoothPermission = async () => {
    try {
      // Check if Web Bluetooth API is available
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API is not available in your browser');
      }
      
      // Just check if we can get the Bluetooth permission
      await navigator.bluetooth.getAvailability();
      return true;
    } catch (error) {
      console.error('Bluetooth permission error:', error);
      return false;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  };

  const handleFormSubmit = (formData) => {
    setUserDetails(formData);
    localDB.saveUserDetails(formData);
    setShowForm(false);
    setShowEmergencyForm(true);
    console.log('User details saved:', formData);
  };

  const handleEmergencyFormSubmit = (formData) => {
    setEmergencyContact(formData);
    localDB.saveEmergencyContact(formData);
    setShowEmergencyForm(false);
    console.log('Emergency contact saved:', formData);
  };

  const handlePermission = async (permission, accepted) => {
    if (accepted) {
      let permissionGranted = false;

      switch (permission) {
        case 'bluetooth':
          permissionGranted = await requestBluetoothPermission();
          break;
        case 'phone':
          permissionGranted = await requestNotificationPermission();
          break;
        case 'sms':
          permissionGranted = await requestNotificationPermission();
          break;
        default:
          break;
      }

      const newPermissions = {
        ...permissions,
        [permission]: permissionGranted
      };
      
      setPermissions(newPermissions);
      localDB.savePermissions(newPermissions);

      if (!permissionGranted) {
        alert(`Could not get ${permission} permission. Please check your browser settings.`);
      }
    } else {
      const newPermissions = {
        ...permissions,
        [permission]: false
      };
      setPermissions(newPermissions);
      localDB.savePermissions(newPermissions);
    }

    switch (permission) {
      case 'bluetooth':
        setCurrentPermission('phone');
        break;
      case 'phone':
        setCurrentPermission('sms');
        break;
      case 'sms':
        setCurrentPermission(null);
        setShowForm(true);
        break;
      default:
        break;
    }
  };

  const getPermissionContent = () => {
    switch (currentPermission) {
      case 'bluetooth':
        return {
          title: 'Bluetooth Permission',
          message: 'RideAlert needs permission to connect to your bluetooth device. Please allow access to continue.'
        };
      case 'phone':
        return {
          title: 'Phone Permission',
          message: 'RideAlert needs permission to make phone calls. Please allow access to continue.'
        };
      case 'sms':
        return {
          title: 'SMS Permission',
          message: 'RideAlert needs permission to send SMS messages. Please allow access to continue.'
        };
      default:
        return null;
    }
  };

  const handleHelmetNameSubmit = (e) => {
    e.preventDefault();
    setEditingHelmetName(false);
    localDB.saveHelmetName(helmetName); // Save to localStorage
  };

  const handleBluetoothClick = () => {
    setShowBluetoothModal(true);
  };

  const handleSignOut = () => {
    localDB.clearAllData();
    setUserDetails(null);
    setEmergencyContact(null);
    setPermissions({
      bluetooth: false,
      phone: false,
      sms: false
    });
    setHelmetName("Smart Helmet X1");
    // Additional cleanup if needed
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Add this useEffect for theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Add this near the top of your App component
  useEffect(() => {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Update EditDetails handlers
  const handleUpdateUserDetails = (data) => {
    setUserDetails(data);
    localDB.saveUserDetails(data);
    console.log('User details updated:', data);
  };

  const handleUpdateEmergencyContact = (data) => {
    setEmergencyContact(data);
    localDB.saveEmergencyContact(data);
    console.log('Emergency contact updated:', data);
  };

  const handleUpdatePermissions = (newPermissions) => {
    setPermissions(newPermissions);
    localDB.savePermissions(newPermissions);
    console.log('Permissions updated:', newPermissions);
  };

  const handleNavigationClick = () => {
    setShowNavigationInput(true);
  };

  const handleNavigationSubmit = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      // Open Google Maps with the destination
      const encodedDestination = encodeURIComponent(destination);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`, '_blank');
      setShowNavigationInput(false);
      setDestination('');
    }
  };

  return (
    <div className="App">
      <Navbar 
        onEditDetailsClick={setCurrentPage}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      {!hasCompletedSetup() && currentPermission && (
        <PermissionModal
          {...getPermissionContent()}
          onAccept={() => handlePermission(currentPermission, true)}
          onDeny={() => handlePermission(currentPermission, false)}
        />
      )}

      {!hasCompletedSetup() && showForm && <UserDetailsForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} initialData={userDetails} />}
      
      {!hasCompletedSetup() && showEmergencyForm && <EmergencyContactForm onSubmit={handleEmergencyFormSubmit} onCancel={() => setShowEmergencyForm(false)} initialData={emergencyContact} />}

      {(hasCompletedSetup() || (!currentPermission && !showForm && !showEmergencyForm && userDetails)) && (
        currentPage === 'home' ? (
          <>
            <div className="helmet-container">
              <div className="bubble-background">
                {[...Array(60)].map((_, i) => (  // Increased from 40 to 60 bubbles
                  <div 
                    key={i} 
                    className="bubble" 
                    style={{
                      '--delay': `${Math.random() * 5}s`,  // Random delay for more natural effect
                      animationDelay: `${Math.random() * 5}s`  // Add explicit animation delay
                    }}
                  />
                ))}
              </div>
              <div className="helmet-section">
                <img 
                  src="/helmet.png" 
                  alt="Smart Helmet" 
                  className="helmet-image"
                />
                <div className="helmet-name-container">
                  {editingHelmetName ? (
                    <form onSubmit={handleHelmetNameSubmit} className="helmet-name-form">
                      <input
                        type="text"
                        value={helmetName}
                        onChange={(e) => setHelmetName(e.target.value)}
                        className="helmet-name-input"
                        autoFocus
                      />
                      <button type="submit" className="helmet-name-save">Save</button>
                    </form>
                  ) : (
                    <div className="helmet-name-wrapper">
                      <h2 className="helmet-name">{helmetName}</h2>
                      <button 
                        onClick={() => setEditingHelmetName(true)}
                        className="edit-helmet-icon"
                        aria-label="Edit helmet name"
                      >
                        <span className="material-icons">edit</span>
                      </button>
                    </div>
                  )}
                  {/* Add the navigation buttons here */}
                  <div className="helmet-nav-buttons">
                    <button onClick={handleBluetoothClick} className="nav-item">
                      Connect Device
                    </button>
                    <button onClick={() => setCurrentPage('editDetails')} className="nav-item">
                      Edit Details
                    </button>
                    {showNavigationInput ? (
                      <form onSubmit={handleNavigationSubmit} className="navigation-form">
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Enter destination..."
                          className="navigation-input"
                          autoFocus
                        />
                        <button type="submit" className="navigation-search-btn">
                          <span className="material-icons">search</span>
                        </button>
                      </form>
                    ) : (
                      <button onClick={handleNavigationClick} className="nav-item">
                        Navigation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EditDetails 
            permissions={permissions}
            userDetails={userDetails}
            emergencyContact={emergencyContact}
            PermissionModal={PermissionModal}
            UserDetailsForm={UserDetailsForm}
            EmergencyContactForm={EmergencyContactForm}
            onUpdateUserDetails={handleUpdateUserDetails}
            onUpdateEmergencyContact={handleUpdateEmergencyContact}
            onUpdatePermissions={handleUpdatePermissions}
          />
        )
      )}
      {showBluetoothModal && (
        <BluetoothPairingModal onClose={() => setShowBluetoothModal(false)} />
      )}
    </div>
  );
}

export default App;
