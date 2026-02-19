import React, { useState } from "react";
import { Upload, Modal, message } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import ContinueButton from "../../../../../components/buttons/ContinueButton";

const DashboardSliders = () => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [disabled, setDisable] = useState(false);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleCancel = () => setPreviewOpen(false);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);
      setDisable(true);

      const formData = new FormData();

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      console.log("Submitting:", fileList);

      message.success("Images submitted successfully!");
    } catch (error) {
      console.log(error);
      message.error("Upload failed!");
    } finally {
      setLoading(false);
      setDisable(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "18px" }}>Upload Slider Images</h2>

      <ImgCrop rotationSlider aspect={16 / 9}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={handlePreview}
          multiple
        >
          {fileList.length >= 8 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </ImgCrop>

      <div style={{ marginTop: "20px" }}>
        <ContinueButton
          isloading={isLoading}
          onClick={handleSubmit}
          disabled={disabled}
          text="Submit Images"
        />
      </div>

      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default DashboardSliders;
