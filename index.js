// Your Firebase config (assuming it's already initialized)
var firebaseConfig = {
  apiKey: "AIzaSyDOQKCzqkdDMlLdIpoUyd9Nnd-Z21vuZho",
  authDomain: "evanltd1.firebaseapp.com",
  projectId: "evanltd1",
  storageBucket: "evanltd1.appspot.com",
  messagingSenderId: "700870615513",
  appId: "1:700870615513:web:16d8e42ad88c1b89d7b9c8",
  measurementId: "G-P5NMF5Z2N3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Register function
function register() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!validate_email(email) || !validate_password(password)) {
            throw new Error('Invalid email or password!');
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;

                // Send verification email
                return user.sendEmailVerification()
                    .then(() => {
                        alert('Verification Email Sent. Please verify your email before logging in.');
                        // No automatic login after registration
                    });
            })
            .catch(error => {
                console.error('Error during registration:', error);
                alert(error.message);
            });
    } catch (error) {
        console.error('Error in register function:', error.message);
    }
}

// Login function
function login() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!validate_email(email) || !validate_password(password)) {
            throw new Error('Invalid email or password!');
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;

                if (user.emailVerified) {
                    // Set login_token cookie for .zeeps.me (7 days)
                    document.cookie = `login_token=${user.uid}; max-age=${7 * 24 * 60 * 60}; path=/; domain=.zeeps.me`;

                    alert('Login Successful!');
                    // Redirect to the correct subdomain dashboard
                    window.location.href = 'https://dashboard.zeeps.me';
                } else {
                    alert('Please verify your email before logging in.');
                    // Sign out the user if email is not verified
                    auth.signOut();
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                alert(error.message);
            });
    } catch (error) {
        console.error('Error in login function:', error.message);
    }
}

// Validate email format
function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
}

// Validate password length
function validate_password(password) {
    return password.length >= 6;
}

// Redirect to dashboard if already logged in
auth.onAuthStateChanged(user => {
    if (user) {
        if (user.emailVerified) {
            document.cookie = `login_token=${user.uid}; max-age=${7 * 24 * 60 * 60}; path=/; domain=.zeeps.me`;
            window.location.href = 'https://dashboard.zeeps.me';
        } else {
            // If email is not verified, sign them out
            auth.signOut();
        }
    }
});
