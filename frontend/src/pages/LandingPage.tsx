import plantImage from "../assets/LandingPageImages/cartoonPlant.png";
import closetImage from "../assets/LandingPageImages/closet.png";
import blackheart from "../assets/LandingPageImages/blackheart.png";
import chatbubble from "../assets/LandingPageImages/chat_bubble.png";
import sendbutton from "../assets/LandingPageImages/send.png";
import bookmark from "../assets/LandingPageImages/bookmark.png";
import logo from "../assets/GreenLogo.png";

import { useNavigate } from "react-router-dom"; //this allows us to use navigate funciton to route to other pages

export default function LandingPage(){

  const navigate = useNavigate(); //assigning the function useNavigate returns to the navigate variable so we can just say navigate("/path") instead of useNavigate()(path)

  //making a button class varibale that holds a multiline string denoted by backticks to just populate className for buttons with a variable since its getting pretty long
  const buttonClass = `
    text-white 
    text-3xl 
    bg-themeGray 
    border-4 
    border-themeDarkBeige 
    w-44 h-16 rounded-lg
    cursor-pointer
    hover:scale-105
  `;

  return (

    <div className = "relative flex justify-start items-start h-screen pt-24 gap-20 -translate-x-36"> {/* Outer div takes up whole screen so the inner div can be centered on screen */}

          <div className = "relative flex flex-col items-center justify-center bg-themeGray w-4/6 h-5/6 rounded-lg flex-shrink-0 gap-10"> {/*This div is the gray card containing the closet picture and buttons under it */}

            <img src = {closetImage} alt = "Minimalist closet pic" className = "select-none pointer-events-none w-5/6 h-4/6 rounded-lg"></img> 

            <div className = "flex flex-row justify-center items-center self-start gap-2 ml-16 w-fit"> {/*This div keeps all buttons in a flex row within the flex col that stacks the image and button above each other */}
              <img src = {blackheart} alt = "heart symbol" className = "select-none pointer-events-none w-14 h-14"></img>
              <img src = {chatbubble} alt = "chat bubble symbol" className = "select-none pointer-events-none w-14 h-14"></img>
              <img src = {sendbutton} alt = "send button symbol" className = "select-none pointer-events-none w-14 h-14"></img>
              <img src = {bookmark} alt = "bookmark symbol" className = "select-none pointer-events-none w-14 h-14 absolute right-16"></img>
            </div>

          </div>  

          <div className="flex flex-col flex-shrink-0 gap-16 relative"> {/*Div for dressmeup logo and slogan that will go under the logo*/}

            <img src = {logo} alt = "DressMeUp Logo" className = "select-none pointer-events-none w-44 h-44 rounded-lg" />

            <div className = "absolute top-[118%] w-[600px]"> {/*So I had to wrap the text in a div that was absolute to remove the text from page flow so they wouldnt push flex box with buttons next to it away. This div is relative to the flex col parent */}
              <p className  = "text-left text-7xl leading-normal"> {/*Align text left and since its div's width is fixed p tags wrap on their own so */}
                Revamp your fashion.
                Restyle your favorites. 
                Rewear, reimagined. 
              </p>
            </div>
          </div>

          <div className = "flex flex-col items-center justify-center gap-10 flex-grow-0"> {/*Flex col so that login and about us are stacked on top of each other */}

            <button onClick = {() => navigate("/login")} className = {buttonClass}> Login  </button>
            <button onClick = {() => navigate("/aboutus")} className = {buttonClass}> About Us </button>

            {/*ABOVE ON CLICK NAVIGATES TO ABOUT US DOESNT EXIST CHANGE THAT ROUTE ONCE ETHAN MAKES ABOUT PAGE*/}
          </div>

          <div className = "absolute -right-96 bottom-0"> {/*Plant picture is positioned abolsute (outside of page flow) relative to the screen div */}
            <img src = {plantImage} alt = "plant pic" className = "select-none pointer-events-none w-96 h-80 " ></img>
          </div>
    </div>
  );
}