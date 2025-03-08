// Updated Login.tsx
import { useState } from 'react';
import { buildPath as bp } from './Path.js';

function Login() {
    //using the useState hook so that react can keepp track of these variables as  their state changes eg user types.
    const [message, setMessage] = useState(''); 
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setPassword] = useState('');
    //creating another useState variable that will keep track of what form to show user the login or register. Remeber state is dynamic in react if it changes react automatically re-renders page
    const [isLoginForm, setIsLoginForm] = useState(true); 

    async function doLogin(event: any): Promise<void> {
        event.preventDefault();

        const obj = { Login: loginName, Password: loginPassword };
        const js = JSON.stringify(obj);

        console.log('Login:', loginName);
        console.log('Password:', loginPassword);

        try {
            const response = await fetch(bp('login'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });

            const res = await response.json();

            if (!res.id) {
                setMessage('User/Password combination incorrect');
            } else {
                const user = {
                    firstName: res.firstName,
                    lastName: res.lastName,
                    id: res.id,
                };
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/cards'; //*****this line needs to change to /dahsboard once dashboard is implemented****
            }
        } catch (error: any) {
            alert(error.toString());
        }
    }

    return (
        <div className = "flex flex-col bg-themeGray w-[600px] h-[600px] rounded-lg ">
            
            {/*In here we will have component for the login slider, the login form that will display when isLoginForm state is true, the register form that will
            display when false*/}

        </div>
    );
}

export default Login;