import React, { useState } from "react";
import { Upload, Modal, message } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import ContinueButton from "../../../../../components/buttons/ContinueButton";

const DashboardSliders = () => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [rearrangeUploadedFileList, setRearrangeUploadedFileList] = useState(
    [],
  );
  const [silderOrders, setSliderOrders] = useState([]);
  const [rearrangedSliderOrders, setRearrangedSliderOrders] = useState([
    { deletedOrder: "", newOrder: "" },
  ]);
  const [deletedSliderOrders, setDeletedSliderOrders] = useState([]);
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
  const rearrangeHandlePreview = async (file) => {
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
  const rearrangeOnChange = ({ fileList: newFileList }) => {
    setRearrangeUploadedFileList(newFileList);
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
  const submitRearrange = async () => {
    if (rearrangeUploadedFileList.length === 0) {
      message.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);
      setDisable(true);

      const formData = new FormData();

      rearrangeUploadedFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      console.log("Submitting:", rearrangeUploadedFileList);

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
      <div className="admindashboard-addproduct-card">
        <h2 style={{ marginBottom: "18px" }}>Upload Slider Images</h2>
        <p style={{ marginBottom: "10px" }}>
          upload the image and mention the sequence number of each image in the
          input field below{" "}
        </p>
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
        <input
          type="text"
          value={silderOrders}
          onChange={(e) => setSliderOrders(e.target.value)}
          placeholder="Enter slider orders separated by commas"
          style={{ marginTop: "20px", width: "100%", padding: "10px" }}
        />
        <div style={{ marginTop: "20px" }}>
          <ContinueButton
            isloading={isLoading}
            onClick={handleSubmit}
            disabled={disabled}
            text="Submit Images"
          />
        </div>
      </div>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <div
        className="admindashboard-addproduct-card"
        style={{ marginTop: "20px" }}
      >
        <h2 style={{ marginBottom: "18px" }}>Delete Slider Images</h2>
        <p>
          To delete a slider image, please enter the Sequence number to delete
        </p>
        <input
          type="text"
          value={deletedSliderOrders}
          onChange={(e) => setDeletedSliderOrders(e.target.value)}
          placeholder="Enter slider orders separated by commas"
          style={{ marginTop: "20px", width: "100%", padding: "10px" }}
        />
        <div style={{ marginTop: "20px" }}>
          <ContinueButton
            isloading={isLoading}
            disabled={disabled}
            text="Submit Images"
          />
        </div>
      </div>{" "}
      <div
        className="admindashboard-addproduct-card"
        style={{ marginTop: "20px" }}
      >
        <h2 style={{ marginBottom: "18px" }}>Rearranging Slider Images</h2>
        <p>
          To rearrange slider images, please enter the new sequence numbers in
          order
        </p>
        <input
          type="text"
          value={rearrangedSliderOrders?.deletedOrder}
          onChange={(e) =>
            setRearrangedSliderOrders({
              ...rearrangedSliderOrders,
              deletedOrder: e.target.value,
            })
          }
          placeholder="Enter the silder sequence number to be delete"
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            borderColor: "red",
          }}
        />
        <ImgCrop rotationSlider aspect={16 / 9}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={rearrangeOnChange}
            onPreview={rearrangeHandlePreview}
          >
            {rearrangeUploadedFileList.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </ImgCrop>
        <input
          type="text"
          value={rearrangedSliderOrders?.rearrangedOrders}
          onChange={(e) =>
            setRearrangedSliderOrders({
              ...rearrangedSliderOrders,
              rearrangedOrders: e.target.value,
            })
          }
          placeholder="Enter slider orders separated by commas"
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
          }}
        />
        <div style={{ marginTop: "20px" }}>
          <ContinueButton
            isloading={isLoading}
            disabled={disabled}
            text="Submit Images"
            onClick={submitRearrange}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSliders;
