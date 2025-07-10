
export default function StartMenu(props) {
    return (<>
        
        <div className=" flex flex-col h-screen items-center justify-center text-center gap-[1.5rem] md:gap-[3rem]">
            <div>
                <h1 className="text-indigo-900 font-bold text-[2rem] md:text-[3rem]">Quizzical!</h1>
                <p  className="text-indigo-900  text-[1rem] md:text-[2rem]">Challange your brain</p>
            </div>

            <button 
            onClick={props.flipStartMenu}
            className="bg-[#4d5b9e] w-48 h-[52px] rounded-2xl text-gray-100 cursor-pointer md:w-68 md:h-[64px] md:text-2xl">Start quiz</button>    
        </div>
        </>
    )
}