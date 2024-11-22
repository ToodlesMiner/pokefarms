import { useEffect, useState } from "react";
import stl from "./MessageOverlay.module.css";
import { FaCheck } from "react-icons/fa";

const MessageOverlay = ({ submittedMessage }) => {
  const [message, setMessage] = useState(submittedMessage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  });
  return (
    <div className={stl.messageOverlay}>
      <span className={stl.messageSpan}>
        <FaCheck className={stl.check} />
        {message}
      </span>
    </div>
  );
};

export default MessageOverlay;
