import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import './Login.css';
import '../components/navbar.css';

// Navbar Component
function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (user && user.role === 'admin') {
      navigate('/admindash');
    } else {
      navigate('/userdash');
    }
  };

  return (
    <div className="containerLogin">
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src="/images/clouds.png" alt="Nepal Logo" style={styles.logoImage} />
          <p style={styles.logoText}>NepAir</p>
        </div>
        <div style={styles.navLinks}>
          {user ? (
            <>
              <span style={styles.userName}>
                {user.fullName}
              </span>
              <span style={styles.userRole}>
                ({user.role})
              </span>
              <button
                style={styles.navButton}
                onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
                onClick={goToDashboard}
              >
                Dashboard
              </button>
              <button
                style={styles.navButton}
                onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              style={styles.navButton}
              onMouseEnter={(e) => (e.target.style.backgroundColor = styles.navButtonHover.backgroundColor)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = styles.navButton.backgroundColor)}
              onClick={() => navigate('/')}
            >
              Home
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

const styles = {
  navbar: {
    position: 'absolute',
    top: 0,
    zindex:'100',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0',
  },
  logoContainer: {
    display: 'grid'
  },
  logoImage: {
    width: '70px',
    height: '70px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#F4F4F4',
    paddingLeft:'10px',
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  navButton: {
    padding: '10px 15px',
    border: 'none',
    color: '#FFF',
    backgroundColor: '#0D98BA',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginRight: '10px',
  },
  navButtonHover: {
    backgroundColor: '#FF6F61',
  },
  userName: {
    color: '#FFF',
    fontSize: '16px',
    marginRight: '5px',
  },
  userRole: {
    color: '#FFF',
    fontSize: '14px',
    marginRight: '15px',
  },
};

// Login Component
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role is user
  });
  const [user, setUser ] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Handle Login
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
          if (userCredential.user.emailVerified) {
            const userData = userDoc.data();
            if (userData.role === 'admin' && userData.status !== 'approved') {
              alert("Your admin account is pending approval.");
              return;
            }
            setUser ({ uid: userCredential.user.uid, fullName: `${userData.firstName} ${userData.lastName}`, role: userData.role });
            alert("Login successful!");
          } else {
            alert("Please verify your email address.");
          }
        } else {
          alert("User  data not found.");
        }
      } catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
      }
    } else {
      // Handle Signup
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        // Send email verification link
        await sendEmailVerification(userCredential.user);

        // Save user data to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age,
          gender: formData.gender,
          email: formData.email,
          role: formData.role,
          status: formData.role === 'admin' ? 'pending' : 'approved', // Admins need approval
          createdAt: new Date(),
        });

        alert("Account created successfully! Please verify your email.");
        setIsLogin(true);
      } catch (error) {
        console.error("Signup Error:", error.message);
        alert(error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser (null);
      alert("Logged out successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Logout Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="containerlogin">
        <div className='cardwrapper'>
        <div className="card">
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="user">User </option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Retype Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            )}
            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <p className="toggle-link">
            {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
            <span onClick={toggleForm}>{isLogin ? 'Sign Up' : 'Login'}</span>
          </p>
        </div>
        </div>
      </div>
    </>
  );
};

export default Login;