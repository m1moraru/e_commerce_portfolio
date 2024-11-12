// src/pages/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [consentToMarketing, setConsentToMarketing] = useState(false);
    const [consentToProfiling, setConsentToProfiling] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (!consentToMarketing || !consentToProfiling) {
            alert('You must agree to all terms and conditions.');
            return;
        }
        // Add your signup logic here, possibly calling an API
        console.log('Signing up with:', { title, firstName, lastName, email, password });
        navigate('/login'); // Redirect to login after successful signup
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div>
                    <label>Title:</label>
                    <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    >
                        <option value="">Select Title</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Dr">Dr</option>
                    </select>
                </div>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <h3>Consent to Personal Data Processing</h3>
                </div>

                <div>
                    <input
                        type="checkbox"
                        checked={consentToMarketing}
                        onChange={(e) => setConsentToMarketing(e.target.checked)}
                        required
                    />
                    <label>
                        I agree to the collection and use of my personal data for marketing purposes.
                    </label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        checked={consentToProfiling}
                        onChange={(e) => setConsentToProfiling(e.target.checked)}
                        required
                    />
                    <label>
                        I agree to the collection, disclosure, or processing of my personal data for profiling purposes.
                    </label>
                </div>

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;

