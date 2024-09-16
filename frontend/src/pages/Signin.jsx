import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from 'axios';

export const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const url =import.meta.env.VITE_BACKEND_URL;

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${url}/api/v1/user/signin`, {
        username: email,  
        password: password
      });

      
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Incorrect email or password. Please try again.');
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          
          <InputBox 
            placeholder="rehneet@gmail.com" 
            label={"Email"} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <InputBox 
            placeholder="123456" 
            label={"Password"} 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          {error && <p className="text-red-500">{error}</p>}

          <div className="pt-4">
            <Button label={"Sign in"} onClick={handleSignIn} />
          </div>
          
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  );
};
