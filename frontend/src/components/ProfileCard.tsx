// eslint-disable-next-line @typescript-eslint/no-unused-vars

import ProfilePic from '../assets/About-Images/profile-icon.jpg';

// Define interface for props
interface ProfileCardProps {
  name?: string;
  role?: string;
}

export default function ProfileCard(props: ProfileCardProps) {    
    const infoClass = `
        flex
        flex-col
        justify-center
        text-white 
        bg-themeGray 
        rounded-2xl
        w-[12rem] h-[5rem]
    `;

    return (
        <div className='flex flex-col justify-center items-center h-[210px] w-[210px]'>
            <img src={ProfilePic} alt="profile Icon" className="w-32 h-32 rounded-full relative top-3.5"/>
            <div className={infoClass}>
                <p className='text-center text-lg font-bold'>{props.name || "John Doe"}</p>
                <p className='text-center'>{props.role || "Project Manager"}</p>
            </div>
        </div>
    );
}