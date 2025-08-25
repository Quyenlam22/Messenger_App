import { useNavigate } from 'react-router-dom';
import "./Error404.scss";

function Error404() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="max-w-full h-[60%] text-center">
      <div className="max-w-full">
        <div className="relative h-[240px]">
          <h3 className="relative font-bold text-lg lg:text-xl uppercase tracking-[3px] mt-8 pl-[6px]">Oops! Page not found</h3>
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] lg:text-[252px] font-black tracking-[-40px] -ml-5">
            <span>4</span><span>0</span><span>4</span>
          </h1>
        </div>
        <h2 className="text-xl lg:text-2xl font-normal uppercase text-black mt-0 mb-6">
          We are sorry, but the page you requested was not found
        </h2>
        <button className="bg-[linear-gradient(270deg,_#667eea,_#764ba2,_#667eea)] text-white border-none font-medium px-6 py-4 rounded-md cursor-pointer transition-transform duration-300 ease-in-out hover:bg-[linear-gradient(-135deg,_#667eea,_#764ba2)] hover:scale-105 hover:text-white" onClick={handleBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Error404;