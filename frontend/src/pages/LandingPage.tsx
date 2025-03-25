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
    w-36 h-12
    lg:w-44 lg:h-16 rounded-lg
    cursor-pointer
    hover:scale-105
  `;

  return (

    <div className = "relative flex flex-col justify-start items-center h-screen gap-4 lg:pt-24 lg:gap-20 lg:flex-row lg:-translate-x-36 lg:items-start"> {/* Outer div takes up whole screen so the inner div can be centered on screen */}

          <div className = "order-2 relative flex flex-col items-center justify-center bg-themeGray rounded-lg flex-shrink-0 w-80 h-80 gap-4 pt- lg:gap-10 lg:w-4/6 lg:h-5/6 lg:pt-0 lg:order-1 "> {/*This div is the gray card containing the closet picture and buttons under it */}

            <img src = {closetImage} alt = "Minimalist closet pic" className = "select-none pointer-events-none w-64 h-56 rounded-lg lg:w-5/6 lg:h-4/6"></img> 

            <div className = "flex flex-row justify-center items-center self-start ml-8 w-fit gap-2 lg:ml-16"> {/*This div keeps all buttons in a flex row within the flex col that stacks the image and button above each other */}
              <img src = {blackheart} alt = "heart symbol" className = "select-none pointer-events-none w-9 h-9 lg:w-14 lg:h-14"></img>
              <img src = {chatbubble} alt = "chat bubble symbol" className = "select-none pointer-events-none  w-9 h-9 lg:w-14 lg:h-14"></img>
              <img src = {sendbutton} alt = "send button symbol" className = "select-none pointer-events-none  w-9 h-9 lg:w-14 lg:h-14"></img>
              <img src = {bookmark} alt = "bookmark symbol" className = "select-none pointer-events-none w-9 h-9 absolute right-7 lg:right-16 lg:w-14 lg:h-14"></img>
            </div>

          </div>  

          <div className="flex flex-col flex-shrink-0 gap-16 relative lg:order-2"> {/*Div for dressmeup logo and slogan that will go under the logo*/}

            <img src = {logo} alt = "DressMeUp Logo" className = "select-none pointer-events-none w-36 h-36 lg:w-44 lg:h-44 rounded-lg" />

            <div className = "hidden lg:block lg:absolute lg:top-[118%] lg:w-[600px]"> {/*So I had to wrap the text in a div that was absolute to remove the text from page flow so they wouldnt push flex box with buttons next to it away. This div is relative to the flex col parent */}
              <p className  = "text-left text-7xl leading-normal"> {/*Align text left and since its div's width is fixed p tags wrap on their own so */}
                Revamp your fashion.
                Restyle your favorites. 
                Rewear, reimagined. 
              </p>
            </div>
          </div>


          <div className = "flex items-center justify-center flex-grow-0 gap-8 lg:gap-10 lg:flex-col lg:order-2"> {/*Flex col so that login and about us are stacked on top of each other */}

            <button onClick = {() => navigate("/login")} className = {buttonClass}> Login  </button>
            <button onClick = {() => navigate("/about")} className = {buttonClass}> About Us </button>

            {/*ABOVE ON CLICK NAVIGATES TO ABOUT US DOESNT EXIST CHANGE THAT ROUTE ONCE ETHAN MAKES ABOUT PAGE*/}
          </div>

          <div className = "order-3 lg:hidden"> {/*So I had to wrap the text in a div that was absolute to remove the text from page flow so they wouldnt push flex box with buttons next to it away. This div is relative to the flex col parent */}
              <p className  = "text-left text-3xl leading-normal whitespace-pre-line"> {/*Align text left and since its div's width is fixed p tags wrap on their own so */}
                Revamp your fashion. <br />
                Restyle your favorites. <br />
                Rewear, reimagined. 
              </p>
          </div>

          <div className = "hidden lg:block absolute -right-96 bottom-0"> {/*Plant picture is positioned abolsute (outside of page flow) relative to the screen div */}
            <img src = {plantImage} alt = "plant pic" className = "select-none pointer-events-none w-32 h-24 lg:w-96 lg:h-80 " ></img>
          </div>

    </div>
  );
}