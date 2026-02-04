import { message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./Toast.css";

const presentToast = {
  success: (msg, duration = 3) => {
    const key = `success_${Date.now()}`;
    message.open({
      type: "success",
      content: (
        <div className="custom-toast">
          <span>{msg}</span>
          <CloseOutlined
            className="toast-close-icon"
            onClick={() => message.destroy(key)}
          />
        </div>
      ),
      duration,
      key,
    });
  },

  error: (msg, duration = 3) => {
    const key = `error_${Date.now()}`;
    message.open({
      type: "error",
      content: (
        <div className="custom-toast">
          <span>{msg}</span>
          <CloseOutlined
            className="toast-close-icon"
            onClick={() => message.destroy(key)}
          />
        </div>
      ),
      duration,
      key,
    });
  },
};

export default presentToast;
