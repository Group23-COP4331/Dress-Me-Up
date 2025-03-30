import React from 'react';
import ProfilePic from '../assets/About-Images/profile-icon.jpg';

export default function profileCard({name = "John Doe", role = "Developer", pic = ProfilePic}){    

    const infoClass = `
        flex
        flex-col
        justify-center
        text-white 
        bg-themeGray 
        rounded-2xl
        w-[12rem] h-[5rem]
        shadow-2xl
    `;

    return (
        <div className='flex flex-col jusitfy-center items-center h-[210px] w-[210px]'>
            <img src={pic} alt="profile Icon" className="w-32 h-32 rounded-full relative top-3.5 object-cover shadow-lg"/>
            <div className= {infoClass}>
                <p className='text-center text-lg font-bold'>{name}</p>
                <p className='text-center'>{role}</p>
            </div>
        </div>
    );
}









