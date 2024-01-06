
function Prayer(props) {
    return (
        <div className='bg-[#eee] shadow-sm pb-5 w-full md:w-[17%] cursor-pointer hover:md:w-[18%] hover:shadow-lg transition-all duration-300 font-sans text-lg'>
            <img src={props.src} alt="" className='w-full h-[10%] mb-6' />
            <div className='flex justify-center items-center flex-col gap-5'>
                <p className="text-[40px] font-light">{props.name}</p>
                <p className="text-[40px] font-light">{props.time}</p>
            </div>
        </div>
    )
}

export default Prayer