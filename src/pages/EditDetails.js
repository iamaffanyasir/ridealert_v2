import React from 'react';

function EditDetails({ permissions, userDetails, emergencyContact }) {
  return (
    <div className="edit-details-page">
      <h2 className="page-title">Edit Details</h2>
      <div className="dashboard-container">
        <div className="info-box permissions-box">
          <div className="box-header">
            <h3>Permissions Status</h3>
            <button className="edit-box-btn">
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
            <button className="edit-box-btn">
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
              <button className="edit-box-btn">
                <span className="material-icons">edit</span>
              </button>
            </div>
            <div className="details-content">
              <p><span>Name:</span> {emergencyContact.emergencyName}</p>
              <p><span>Phone:</span> {emergencyContact.emergencyPhone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditDetails;
