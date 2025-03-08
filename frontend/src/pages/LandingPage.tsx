import plantImage from "../assets/LandingPageImages/cartoonPlant.png";
import closetImage from "../assets/LandingPageImages/closet.png";
import blackheart from "../assets/LandingPageImages/blackheart.png";
import chatbubble from "../assets/LandingPageImages/chat_bubble.png";
import sendbutton from "../assets/LandingPageImages/send.png";
import bookmark from "../assets/LandingPageImages/bookmark.png";
import logo from "../assets/GreenLogo.png";

export default function LandingPage(){
  return (

    <div className = "relative flex justify-start items-start h-screen pt-24 gap-20 -translate-x-36"> {/* Outer div takes up whole screen so the inner div can be centered on screen */}

          <div className = "relative flex flex-col items-center justify-center bg-themeGray w-4/6 h-5/6 rounded-lg flex-shrink-0 gap-10"> {/*This div is the gray card containing the closet picture and buttons under it */}

            <img src = {closetImage} alt = "Minimalist closet pic" className = "w-5/6 h-4/6 rounded-lg"></img> 

            <div className = "flex flex-row justify-center items-center self-start gap-2 ml-16 w-fit"> {/*This div keeps all buttons in a flex row within the flex col that stacks the image and button above each other */}
              <img src = {blackheart} alt = "heart symbol" className = "w-14 h-14"></img>
              <img src = {chatbubble} alt = "chat bubble symbol" className = "w-14 h-14"></img>
              <img src = {sendbutton} alt = "send button symbol" className = "w-14 h-14"></img>
              <img src = {bookmark} alt = "bookmark symbol" className = " w-14 h-14 absolute right-16"></img>
            </div>

          </div>  

          <div className="flex flex-col flex-shrink-0 gap-16 relative"> {/*Div for dressmeup logo and slogan that will go under the logo*/}

            <img src = {logo} alt = "DressMeUp Logo" className = "w-44 h-44 rounded-lg" />

            <div className = "absolute top-[118%] w-[600px]"> {/*So I had to wrap the text in a div that was absolute to remove the text from page flow so they wouldnt push flex box with buttons next to it away. This div is relative to the flex col parent */}
              <p className  = "text-left text-7xl leading-normal"> {/*Align text left and since its div's width is fixed p tags wrap on their own so */}
                Revamp your fashion.
                Restyle your favorites. 
                Rewear, reimagined. 
              </p>
            </div>
          </div>

          <div className = "flex flex-col items-center justify-center gap-10 flex-grow-0"> {/*Flex col so that login and about us are stacked on top of each other */}
            <button className = "text-white text-3xl bg-themeGray border-4 border-themeDarkBeige w-44 h-16 rounded-lg"> Login  </button>
            <button className = "text-white text-3xl bg-themeGray border-4 border-themeDarkBeige w-44 h-16 rounded-lg"> About Us </button>

          </div>

          <div className = "absolute -right-96 bottom-0"> {/*Plant picture is positioned abolsute (outside of page flow) relative to the screen div */}
            <img src = {plantImage} alt = "plant pic" className = "w-96 h-80 " ></img>
          </div>
    </div>
  );
}