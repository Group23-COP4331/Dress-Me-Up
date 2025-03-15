interface SliderButtonProps{ //defining an interface to give the types of the props being passed into component so that if they are wrong props TS yells at us
  isLoginForm: boolean; //isLoginForm is the actual state
  toggleForm: () => void; //we need a funtion passed in that handles the toggling of the isLoginForm state from true to false
}

export default function SliderButton({isLoginForm, toggleForm}: SliderButtonProps){

  return(
    <div className = "flex flex-row justify-center items-center bg-themeDarkBeige w-56 h-16 rounded-3xl mt-10 relative"> {/*Div that shows the dark beige box that contians the login and register message on center of login box */}
      
      <button className = "flex flex-row w-full justify-between px-7 z-10" onClick = {toggleForm}> {/*Only need to make one button since login and register prompt are within  same oval. Whenever button gets clicked wse call toggleForm which changes the boolean state of our isLoginForm variable */}
        <span className = "text-lg">Login</span>
        <span className = "text-lg">Register</span>
      </button>

      {/*This div is for the green oval that is half the width of parent div so that it can slide left and right depending on what form user is clicking on. We use a template literal denoted by backticks to insert a variable into the className we asre checking the state of isLoginForm if it is true return className property trasnslate-0 to keep slider on left if false move it right full widith of parent container so slider is over the register section  */}
      <div className = {`absolute w-28 h-16 bg-themeGreen rounded-3xl z-0 left-0 transition-transform duration-300 ${isLoginForm ? "translate-x-0" : "translate-x-full"}`}> </div>

    </div>

  );

}