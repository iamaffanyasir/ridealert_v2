import { useState, useEffect } from 'react';
import './App.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>RideAlert</h1>
      </div>
      <div className="navbar-menu">
        <button className="nav-item">My Device</button>
        <button className="nav-item">Edit Details</button>
        <button className="nav-item">Navigation</button>
      </div>
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

function UserDetailsForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: ''
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
        <h2>User Details</h2>
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
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

function EmergencyContactForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    emergencyName: '',
    emergencyPhone: ''
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
        <h2>Emergency Contact</h2>
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
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [permissions, setPermissions] = useState({
    bluetooth: false,
    phone: false,
    sms: false
  });
  const [helmetName, setHelmetName] = useState("Smart Helmet X1");
  const [editingHelmetName, setEditingHelmetName] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setCurrentPermission('bluetooth');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const requestBluetoothPermission = async () => {
    try {
      // Request Bluetooth device
      await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });
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

      setPermissions(prev => ({
        ...prev,
        [permission]: permissionGranted
      }));

      if (!permissionGranted) {
        alert(`Could not get ${permission} permission. Please check your browser settings.`);
      }
    } else {
      setPermissions(prev => ({
        ...prev,
        [permission]: false
      }));
    }

    // Move to next permission or show form
    switch (permission) {
      case 'bluetooth':
        setCurrentPermission('phone');
        break;
      case 'phone':
        setCurrentPermission('sms');
        break;
      case 'sms':
        setCurrentPermission(null);
        setShowForm(true); // Show form after all permissions are handled
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = (formData) => {
    setUserDetails(formData);
    setShowForm(false);
    setShowEmergencyForm(true); // Show emergency contact form after user details
    console.log('Form submitted:', formData);
  };

  const handleEmergencyFormSubmit = (formData) => {
    setEmergencyContact(formData);
    setShowEmergencyForm(false);
    console.log('Emergency contact submitted:', formData);
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
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <h1>RideAlert</h1>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      {currentPermission && (
        <PermissionModal
          {...getPermissionContent()}
          onAccept={() => handlePermission(currentPermission, true)}
          onDeny={() => handlePermission(currentPermission, false)}
        />
      )}

      {showForm && <UserDetailsForm onSubmit={handleFormSubmit} />}
      
      {showEmergencyForm && <EmergencyContactForm onSubmit={handleEmergencyFormSubmit} />}

      {!currentPermission && !showForm && !showEmergencyForm && userDetails && (
        <>
          <div className="helmet-container">
            <div className="bubble-background">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="bubble" style={{
                  '--delay': `${Math.random() * 4}s`,
                  '--position': `${Math.random() * 100}%`
                }}></div>
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
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="dashboard-container">
            <div className="info-box permissions-box">
              <h3>Permissions Status</h3>
              <div className="permission-items">
                <p>Bluetooth: {permissions.bluetooth ? '✅' : '❌'}</p>
                <p>Phone: {permissions.phone ? '✅' : '❌'}</p>
                <p>SMS: {permissions.sms ? '✅' : '❌'}</p>
              </div>
            </div>

            <div className="info-box user-box">
              <h3>User Details</h3>
              <div className="details-content">
                <p><span>Name:</span> {userDetails.name}</p>
                <p><span>Email:</span> {userDetails.email}</p>
                <p><span>Phone:</span> {userDetails.phone}</p>
                <p><span>Address:</span> {userDetails.address}</p>
              </div>
            </div>

            {emergencyContact && (
              <div className="info-box emergency-box">
                <h3>Emergency Contact</h3>
                <div className="details-content">
                  <p><span>Name:</span> {emergencyContact.emergencyName}</p>
                  <p><span>Phone:</span> {emergencyContact.emergencyPhone}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
