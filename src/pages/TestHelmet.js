import React, { useState, useEffect } from 'react';

function TestHelmet({ onClose }) {
  const [activeButton, setActiveButton] = useState(null);
  const [isCrashDetected, setIsCrashDetected] = useState(false);
  const [bluetoothDevice, setBluetoothDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);

  useEffect(() => {
    // Try to reconnect to the device
    const connectToDevice = async () => {
      const savedDevice = localStorage.getItem('connectedDevice');
      if (savedDevice) {
        try {
          const deviceInfo = JSON.parse(savedDevice);
          const devices = await navigator.bluetooth.getDevices();
          const device = devices.find(d => d.id === deviceInfo.id);
          
          if (device) {
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
            const characteristic = await service.getCharacteristic('00001101-0000-1000-8000-00805f9b34fb');
            setBluetoothDevice(device);
            setCharacteristic(characteristic);
          }
        } catch (error) {
          console.error('Reconnection error:', error);
        }
      }
    };

    connectToDevice();
  }, []);

  const sendCommand = async (command) => {
    if (!characteristic) {
      alert('Please connect to the helmet first');
      return;
    }

    try {
      // Send command to ESP32
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(command + '\n')); // Add newline as in ESP32 code
    } catch (error) {
      console.error('Send command error:', error);
      alert('Failed to send command to helmet');
    }
  };

  const handleEmergencyContact = async () => {
    const emergencyContact = JSON.parse(localStorage.getItem('emergencyContact'));
    if (emergencyContact?.emergencyPhone) {
      try {
        // Make phone call
        window.location.href = `tel:${emergencyContact.emergencyPhone}`;
        
        // Send SMS
        const smsUrl = `sms:${emergencyContact.emergencyPhone}?body=SOS - Emergency alert from Smart Helmet`;
        window.open(smsUrl, '_blank');
      } catch (error) {
        console.error('Emergency contact error:', error);
        alert('Failed to contact emergency number');
      }
    } else {
      alert('No emergency contact found');
    }
  };

  const handleButtonClick = async (action) => {
    setActiveButton(action);
    
    switch (action) {
      case 'left':
        await sendCommand('LEFT');
        break;
      case 'right':
        await sendCommand('RIGHT');
        break;
      case 'stop':
        await sendCommand('STOP');
        break;
      case 'crash':
        setIsCrashDetected(true);
        await handleEmergencyContact();
        setTimeout(() => {
          setIsCrashDetected(false);
        }, 3000);
        break;
      default:
        break;
    }
  };

  return (
    <div className="test-helmet-page">
      <div className="test-helmet-content">
        <div className="test-header">
          <h2>Helmet Test Controls</h2>
          <button onClick={onClose} className="close-test-btn">
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="control-buttons">
          <button 
            className={`control-btn ${activeButton === 'left' ? 'active' : ''}`}
            onClick={() => handleButtonClick('left')}
          >
            <span className="material-icons">turn_left</span>
            Left
          </button>
          
          <button 
            className={`control-btn ${activeButton === 'stop' ? 'active' : ''}`}
            onClick={() => handleButtonClick('stop')}
          >
            <span className="material-icons">stop_circle</span>
            Stop
          </button>
          
          <button 
            className={`control-btn ${activeButton === 'right' ? 'active' : ''}`}
            onClick={() => handleButtonClick('right')}
          >
            <span className="material-icons">turn_right</span>
            Right
          </button>
          
          <button 
            className={`control-btn crash-btn ${isCrashDetected ? 'detecting' : ''}`}
            onClick={() => handleButtonClick('crash')}
          >
            <span className="material-icons">warning</span>
            {isCrashDetected ? 'Detecting...' : 'Crash Detection'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestHelmet; 