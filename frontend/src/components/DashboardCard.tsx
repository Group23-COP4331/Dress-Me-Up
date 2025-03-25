

export default function DashboardCard(props){
    return (
        <div className="bg-themeGray w-full h-[700px] rounded-lg flex flex-col items-center justify-center">
            <h1>{props.title}</h1>
            <p>The quick fox jumps over the lazy dog.</p>
        </div>
    );
}