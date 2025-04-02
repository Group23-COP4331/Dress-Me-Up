import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { Link, To } from 'react-router-dom';

export default function DashboardCard(props: { route: To; pic: any; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; desc: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }){
    return (
        <Link to={props.route} className="bg-no-repeat bg-cover w-[350px] h-[400px] sm:w-[550px] sm:h-[600px] lg:w-[650px] lg:h-[700px] rounded-3xl z-[0] shadow-xl hover:brightness-125 hover:scale-[1.03] ease-in duration-200"
        style={{ backgroundImage: `url(${props.pic})` }}>
            {/* Rembmer to adjust margins when I refactor this code*/}
            <div className="w-full h-full flex flex-col items-center justify-center px-16 bg-black/50 rounded-3xl">
                <h1 className="sm:text-6xl z-[2] text-5xl text-white font-extrabold mb-8 drop-shadow-lg">{props.title}</h1>
                <h6 className=" mb-10 z-[2] text-xl text-white text-wrap font-medium sdrop-shadow-lg">{props.desc}</h6>
            </div>
        </Link>
    );
}