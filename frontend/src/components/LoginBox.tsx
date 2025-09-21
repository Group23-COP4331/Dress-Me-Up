// Updated Login.tsx
import { useState } from 'react';

//below imports are the components that we call and show up on our login box
import SliderButton from './SliderButton.js';
import RegisterForm from './RegisterForm.js';
import LoginForm from './LoginForm.js';

function Login() {
    const [message, setMessage] = useState(''); 
    //creating another useState variable that will keep track of what form to show user the login or register. Remeber state is dynamic in react if it changes react automatically re-renders page
    const [isLoginForm, setIsLoginForm] = useState(true); 

    const toggleForm = () => {
        setIsLoginForm((prev) => !prev); //declaring a callback function toggleForm that calls the setIsLoginForm which has a callback function inside thaat uses Functional Updating to flip the treu to false and vice versa. "prev" is what the state was before aand we flip it
        setMessage(''); // Reset message state when switching forms so when looking at register form we arent displaying state we set in login form
    }



    return (
        <div className = "flex flex-col justify-start items-center bg-themeGray w-full max-w-xl mx-4 lg:w-[600px] pb-8 rounded-3xl gap-4 shadow-lg ">

            <SliderButton isLoginForm = {isLoginForm} toggleForm = {toggleForm}/> {/*Call slider button to display login / register button at top of div container. Passing it bool isLoginForm so we can keep track of state */}
            
            {isLoginForm ? <LoginForm setMessage = {setMessage}/> : <RegisterForm setMessage = {setMessage}/>}{/*Since our above slider button is chaning the isLoginForm state just use a ternary operation to check value of this bool and display  adequte component to render depending on whether loginForm is true or false */}
            
            <p className = "text-red-700 text-lg font-semibold max-w-[500px]">{message}</p>

        </div>
    );
}

export default Login;