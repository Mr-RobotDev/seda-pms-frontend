import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Input, Tag, theme } from "antd";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { validateEmail, isValidTimeFormat } from "@/utils/helper_functions";
import { Select } from "antd";
import toast from "react-hot-toast";
import { ReportsType } from "@/type";

const { Option } = Select;

interface CustomTagsProps {
  recipientEamils: string[];
  type: string;
  setFormData: React.Dispatch<React.SetStateAction<ReportsType | null>>;
}

const options = Array.from({ length: 25 }, (_, index) => {
  const hours = index.toString().padStart(2, "0");
  return (
    <Option key={hours + ":00"} value={hours + ":00"}>
      {hours + ":00"}
    </Option>
  );
});

const CustomTags = ({
  recipientEamils,
  type,
  setFormData,
}: CustomTagsProps) => {
  const { token } = theme.useToken();
  const [emails, setEmails] = useState(recipientEamils);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);
  const [selectedTime, setSelectedTime] = useState("00:00");

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    setEmails(recipientEamils);
  }, [recipientEamils]);

  const handleClose = (removedTag: string) => {
    const newTags = emails.filter((email) => email !== removedTag);
    console.log(newTags);
    setEmails(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (type === "email") {
      const isValidEmail = validateEmail(inputValue);
      if (inputValue && emails.indexOf(inputValue) === -1 && isValidEmail) {
        setEmails([...emails, inputValue]);
        setInputVisible(false);
        setInputValue("");

        setFormData(
          (prevState) =>
            prevState && {
              ...prevState,
              recipients: [...emails, inputValue],
            }
        );
      } else {
        toast.error("Cannot add this to the list");
      }
    } else {
      const isValidTime = isValidTimeFormat(selectedTime);
      if (selectedTime && emails.indexOf(selectedTime) === -1 && isValidTime) {
        setEmails([...emails, selectedTime]);
        setInputVisible(false);
        setInputValue("");
        setFormData(
          (prevState) =>
            prevState && {
              ...prevState,
              times: [...emails, selectedTime],
            }
        );
      } else {
        toast.error("Cannot add this to the list");
      }
    }
  };

  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div className=" flex flex-row flex-wrap gap-2 border-b border-b-blue-300 pb-2">
          {emails.map((email) => (
            <span
              key={email}
              className=" inline-block px-2 py-1 border border-gray-300 rounded-2xl"
            >
              <span className=" flex flex-row gap-2">
                {email}
                <XCircleIcon
                  width={20}
                  className=" cursor-pointer"
                  onClick={() => handleClose(email)}
                />
              </span>
            </span>
          ))}
          <div className=" flex items-center justify-center">
            {inputVisible ? (
              type === "email" ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={{ width: 200 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                  placeholder={
                    type === "email" ? "example@example.com" : "00:00"
                  }
                />
              ) : (
                <div className=" flex items-center gap-2">
                  <Select
                    onChange={(value) => setSelectedTime(value)}
                    defaultValue="00:00"
                    style={{ width: 120 }}
                  >
                    {options}
                  </Select>
                  <button
                    onClick={handleInputConfirm}
                    className=" px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add
                  </button>
                </div>
              )
            ) : (
              <Tag
                onClick={showInput}
                className=" cursor-pointer"
                style={tagPlusStyle}
              >
                <PlusOutlined />{" "}
                {type === "email" ? "Add New Recipient Email" : "Add Time"}
              </Tag>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomTags;
