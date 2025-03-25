import { Link } from 'react-router-dom';

export default function DashboardCard(props){
    return (
        <Link to="." className="bg-themeGray w-[650px] h-[700px] rounded-3xl flex flex-col items-center justify-center shadow-lg px-10 ">
            {/* Rembmer to adjust margins when I refactor this code*/}
            <h1 className="text-5xl z-[2] text-white font-semibold mb-8 drop-shadow-lg">{props.title}</h1>
            <p className=" mb-10 z-[2] text-xl text-white text-wrap font-semibold sdrop-shadow-lg">{props.desc}</p>
            <img src={props.pic} className='z-[1] relative object-cover rounded-3xl shadow-lg'></img>
        </Link>
    );
}