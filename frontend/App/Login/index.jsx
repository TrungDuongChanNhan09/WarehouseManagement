import React from 'react';
import { Heading, Button, Input, CheckBox } from '../../Components';

const LoginPage = () => {
  return (
    <div style={styles.container}>
      {/* About Us Section */}
      <div style={styles.aboutUsSection}>
        <div style={styles.aboutUsContent}>
          <Heading as="h1" style={styles.heading1}>
            About us
          </Heading>
          <Heading as="h2" style={styles.heading2}>
            Our warehouse management team excels in efficiency, precision, and reliability. We are committed to
            delivering top-tier management practices that ensure seamless operations, from inventory tracking to order
            fulfillment. With a focus on optimizing space, minimizing errors, and streamlining processes, we
            consistently achieve fast and accurate deliveries.
          </Heading>
        </div>
      </div>

      {/* Sign In Form Section */}
      <div style={styles.signInSection}>
        <img src="/images/Logo.png" alt="Logo" style={styles.logo} />
        <div style={styles.signInHeader}>
          <h2 style={styles.signInHeading}>Sign In</h2>
        </div>
        <div style={styles.formContainer}>
          {/* Username Input */}
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Username</label>
            <Input
              name="Username"
              placeholder="Enter your username"
              style={styles.input}
            />
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Password</label>
            <Input
              name="Password"
              type="password"
              placeholder="Enter your password"
              style={styles.input}
            />
          </div>

          {/* Show Password Checkbox */}
          <div style={styles.checkboxContainer}>
            <CheckBox
              name="ShowPassword"
              label="Show password"
              id="ShowPassword"
              style={styles.checkbox}
            />
          </div>

          {/* Login Button */}
          <div style={styles.loginButtonContainer}>
            <Button style={styles.loginButton}>Login</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    height: '100vh',
  },
  aboutUsSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundImage: 'url(/images/new-background.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    padding: '50px',
  },
  aboutUsContent: {
    background: 'linear-gradient(to right, #000000, transparent)',
    padding: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  heading1: {
    fontSize: '50px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  heading2: {
    fontSize: '30px',
    fontWeight: 'bold',
    lineHeight: '1.5',
    color: '#ffffff',
  },
  signInSection: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  logo: {
    height: '150px',
    width: '150px',
    marginBottom: '20px',
    objectFit: 'contain',
  },
  signInHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  signInHeading: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#f25d07',
    marginBottom: '20px',
  },
  formContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px', // Khoảng cách giữa label và textbox
  },
  inputLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#000000',
  },
  input: {
    backgroundColor: '#ffffff',
    border: '1px solid #000',
    borderRadius: '5px',
    padding: '10px',
    fontSize: '16px',
    width: '80%',
  },
  checkboxContainer: {
    alignSelf: 'flex-start',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  loginButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  loginButton: {
    backgroundColor: '#f25d07',
    color: '#ffffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center',
    width: '50%',
  },
};

export default LoginPage;
