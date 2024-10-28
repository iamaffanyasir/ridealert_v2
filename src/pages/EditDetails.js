import React, { useState } from 'react';

function EditDetails({ 
  permissions, 
  userDetails, 
  emergencyContact,
  PermissionModal,
  UserDetailsForm,
  EmergencyContactForm,
  onUpdateUserDetails,
  onUpdateEmergencyContact,
  onUpdatePermissions
}) {
  const [currentPermission, setCurrentPermission] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);

  const handlePermissionsEdit = () => {
    setCurrentPermission('bluetooth');
  };

  const handlePermissionComplete = (permission) => {
    switch (permission) {
      case 'bluetooth':
        setCurrentPermission('phone');
        break;
      case 'phone':
        setCurrentPermission('sms');
        break;
      case 'sms':
        setCurrentPermission(null);
        break;
      default:
        break;
    }
  };

  return (
    <div className="edit-details-page">
      <h2 className="page-title">Update Details</h2>
      <div className="dashboard-container">
        <div className="info-box permissions-box">
          <div className="box-header">
            <h3>Permissions Status</h3>
            <button className="edit-box-btn" onClick={handlePermissionsEdit}>
              <span className="material-icons">edit</span>
            </button>
          </div>
          <div className="permission-items">
            <p className={permissions.bluetooth ? 'granted' : 'denied'}>
              Bluetooth {permissions.bluetooth ? '✓' : '×'}
            </p>
            <p className={permissions.phone ? 'granted' : 'denied'}>
              Phone {permissions.phone ? '✓' : '×'}
            </p>
            <p className={permissions.sms ? 'granted' : 'denied'}>
              SMS {permissions.sms ? '✓' : '×'}
            </p>
          </div>
        </div>

        <div className="info-box user-box">
          <div className="box-header">
            <h3>User Details</h3>
            <button className="edit-box-btn" onClick={() => setShowUserForm(true)}>
              <span className="material-icons">edit</span>
            </button>
          </div>
          <div className="details-content">
            <p><span>Name:</span> {userDetails.name}</p>
            <p><span>Email:</span> {userDetails.email}</p>
            <p><span>Phone:</span> {userDetails.phone}</p>
            <p><span>Address:</span> {userDetails.address}</p>
          </div>
        </div>

        {emergencyContact && (
          <div className="info-box emergency-box">
            <div className="box-header">
              <h3>Emergency Contact</h3>
              <button className="edit-box-btn" onClick={() => setShowEmergencyForm(true)}>
                <span className="material-icons">edit</span>
              </button>
            </div>
            <div className="details-content">
              <p><span>Name:</span> {emergencyContact.emergencyName}</p>
              <p><span>Phone:</span> {emergencyContact.emergencyPhone}</p>
            </div>
          </div>
        )}

        {/* Permission Modals */}
        {currentPermission && (
          <PermissionModal
            title={`${currentPermission.charAt(0).toUpperCase() + currentPermission.slice(1)} Permission`}
            message={`RideAlert needs permission to access ${currentPermission}. Please allow access to continue.`}
            onAccept={() => handlePermissionComplete(currentPermission)}
            onDeny={() => setCurrentPermission(null)}
          />
        )}

        {/* User Details Form */}
        {showUserForm && (
          <UserDetailsForm 
            initialData={userDetails}
            onSubmit={(data) => {
              onUpdateUserDetails(data);
              setShowUserForm(false);
            }}
            onCancel={() => setShowUserForm(false)}
          />
        )}

        {/* Emergency Contact Form */}
        {showEmergencyForm && (
          <EmergencyContactForm 
            initialData={emergencyContact}
            onSubmit={(data) => {
              onUpdateEmergencyContact(data);
              setShowEmergencyForm(false);
            }}
            onCancel={() => setShowEmergencyForm(false)}
          />
        )}
      </div>
    </div>
  );
}

export default EditDetails;
