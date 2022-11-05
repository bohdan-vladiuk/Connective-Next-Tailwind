import InputField from "../../components/input-field";
import Logo from "../../components/logo";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import OnboardingSidebar from "../../components/onboarding-sidebar";
import Link from "next/link";
import Image from "next/image";
import googleIcon from "../../public/assets/google-icon.svg";

export default function SignUp() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [tacError, setTacError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const submitAccount = async () => {
    let checkboxChecked = document.getElementById("checkbox").checked;

    if (name == "") {
      setNameError("You must enter a name.");
      setEmailError("");
      setPasswordError("");
      setTacError("");
      return;
    }
    if (email == "") {
      setEmailError("You must enter an email.");
      setNameError("");
      setPasswordError("");
      setTacError("");
      return;
    }
    if (password == "") {
      setPasswordError("You must enter a password.");
      setNameError("");
      setEmailError("");
      setTacError("");
      return;
    }
    if (!checkboxChecked) {
      setTacError("You must accept the terms and conditions");
      setPasswordError("");
      setNameError("");
      setEmailError("");
      return;
    }

    setNameError("");
    setPasswordError("");
    setEmailError("");

    await axios({
      method: "post",
      url: "/api/auth/signup",
      data: { username: name, email, password },
    })
      .then(() => {
        router.push("/auth/signin");
      })
      .catch((e) => {
        if (e.response.data.error == "Email already exists") {
          setEmailError("Email already exists.");
        } else {
          console.log(e);
        }
      });
  };

  const showPasswordHandler = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <main className="flex flex-row min-h-screen min-w-screen gap-[90px] justify-center 2bp:gap-[50px]">
      <OnboardingSidebar></OnboardingSidebar>

      <div className="flex flex-col max-w-[704px] w-[100%] font-[Montserrat] my-[92px] mr-[32px]">
        <div>
          <p className="font-bold text-[32px] leading-[39px] text-[#0D1011]">
            Sign up
          </p>
          <p className="text-[#414141] mt-[12px] font-normal text-[16px] leading-[24px] font-[Poppins]  1bp:text-[18px]">
            Have an account?{" "}
            <Link href="./signin">
              <span className="font-bold cursor-pointer">Log In</span>
            </Link>
          </p>
          <div
            className="h–[47px] flex flex-row items-center w-[100%] bg-[#EFEFEF] mt-[40px] justify-center rounded-[8px] gap-[11.67px] py-[14.47px] cursor-pointer"
            onClick=""
          >
            <Image
              className="w-[16.67px] h-[16.67px] 1bp:w-[20px] 1bp:h-[20px]"
              src={googleIcon}
              alt="Google"
              width="16.67px"
              height="16.67px"
            />
            <p className="font-normal text-[12px] leading-[18px] text-[#0D1011] font-[Poppins] 1bp:text-[14px]">
              Sign up with Google
            </p>
          </div>
          <div className="flex flex-row items-center gap-[12px] mt-[24px]">
            <div className="w-[100%] h-[1px] bg-[#D9D9D9]" />
            <div>
              <p className="font-normal text-[12px] leading-[18px] text-[#414141] font-[Poppins] 1bp:text-[14px]">
                or
              </p>
            </div>
            <div className="w-[100%] h-[1px] bg-[#D9D9D9]" />
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-[28px]">
          <InputField
            name={"Name"}
            placeholder={"Enter your name"}
            updateValue={setName}
            errorText={nameError}
          ></InputField>

          <InputField
            name={"Email"}
            placeholder={"Enter your email"}
            updateValue={setEmail}
            errorText={emailError}
          ></InputField>

          <div className="relative flex flex-row items-center justify-center">
            <InputField
              name={"Password"}
              placeholder={"Enter password"}
              password={!showPassword ? true : false}
              updateValue={setPassword}
              errorText={passwordError}
            ></InputField>
            <div
              className="absolute right-[14px] bottom-[5px] cursor-pointer"
              onClick={showPasswordHandler}
            >
              {!showPassword && (
                <Image
                  src="/assets/eye-slash.svg"
                  alt="eye slash"
                  width="24px"
                  height="24px"
                />
              )}
              {showPassword && (
                <Image
                  src="/assets/eye.svg"
                  alt="eye"
                  width="24px"
                  height="24px"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-[8px] my-[24px] 1bp:gap-[14px] items-center">
          <input
            className="b-[#0D1011] b-[0.5px] w-[16px] h-[16px] 1bp:w-[20px] 1bp:h-[20px]"
            type="checkbox"
            id="checkbox"
          ></input>
          <p className="font-[Poppins] font-normal text-[12px] leading-[18px] text-[#0D1011] 1bp:text-[16px]">
            I accept the{" "}
            <span className="underline cursor-pointer">
              Terms and Conditions
            </span>{" "}
            and I have read the{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
        <p className="text-red-500 font-bold text-[12px]">{tacError}</p>
        <button
          onClick={submitAccount}
          className="w-[229px] h-[47px] bg-[#061A40] font-semibold font-[Poppins] text-[#F2F4F5] text-[12px] leading-[18px] text-center rounded-[8px] shadow-md transition-all hover:scale-105 hover:shadow-lg 1bp:text-[16px]"
        >
          Sign up
        </button>
      </div>
    </main>
  );
}
