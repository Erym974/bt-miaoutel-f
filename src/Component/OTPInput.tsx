import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import "./styles/OTPStyle.scss";

interface OTPInputType {
  length: number;
  setCode: (code: string) => void;
}

export default function OTPInput({ length, setCode }: OTPInputType) {

  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const [selectedInput, setSelectedInput] = useState<number>(0);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }

    document.addEventListener("paste", onPaste);

    return () => {
      document.removeEventListener("paste", onPaste);
    }

  }, []);

  const onPaste = (e: ClipboardEvent) => {
    const clipboard = e.clipboardData?.getData("text") || "";
    if(clipboard.length === length && selectedInput === 0) {
      const newOtp = [...otp];
      for (let i = 0; i < length; i++) {
        newOtp[i] = clipboard[i].toUpperCase();
      }
      setOtp(newOtp);
      setCode(clipboard);
      inputsRef.current[inputsRef.current.length - 1]?.focus();
    }
  }

  const handleOTPChange = (index: number, event: any) => {
    const value = event.target.value;

    const newOtp = [...otp];

    newOtp[index] = value.substring(value.length - 1).toUpperCase();
    setOtp(newOtp);

    if (value && index < length - 1 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }

    if (value) {
      const otpCode = newOtp.join("").trim();

      if (otpCode.length === length) {
        setCode(otpCode);
      } else {
        setCode("");
      }
    }
  };

  const handleClick = (index: number) => {

    inputsRef.current[index]?.setSelectionRange(1, 1);

    setSelectedInput(index);

  };

  const handleKeyDown = (index: number, event: any) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      index > 0 && inputsRef.current[index - 1].focus();

      const otpCode = newOtp.join("").trim();
      if (otpCode.length === length) {
        setCode(otpCode);
      } else {
        setCode("");
      }
    }
  };

  return (
    <div className="otpInputs">
      {otp.map((value: string, index: number) => {
        return (
          <input
            key={index}
            type="text"
            value={value}
            ref={(input) =>
              (inputsRef.current[index] = input as HTMLInputElement)
            }
            onFocus={() => handleClick(index)}
            onChange={(e) => handleOTPChange(index, e)}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="otpInput"
          />
        );
      })}
    </div>
  );
}
