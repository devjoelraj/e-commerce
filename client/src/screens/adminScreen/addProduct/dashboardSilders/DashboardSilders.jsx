import React, { useEffect, useState } from "react";
import { Upload, Modal, message } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import ContinueButton from "../../../../components/buttons/ContinueButton";
import presentToast from "../../../../components/Toast/Toast";
import {
  deleteSildersContentService,
  postSildersContentService,
} from "../../../../api/adminServices/addProductService";
import { getSilderService } from "../../../../api/userServices/userDashboard";

// ---------- Helper: convert comma-separated string to array of numbers ----------
const parseCommaSeparated = (input) => {
  if (!input.trim()) return [];
  return input
    .split(",")
    .map((num) => parseInt(num.trim(), 10))
    .filter((n) => !isNaN(n));
};

// ---------- Helper: convert file to base64 for preview ----------
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// ---------- Upload Slider Card ----------
const UploadSliderCard = () => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [orderInput, setOrderInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    const orders = parseCommaSeparated(orderInput);

    if (fileList.length === 0) {
      message.error("Please upload at least one image");
      return;
    }
    if (orders.length !== fileList.length) {
      message.error("Number of orders must match number of uploaded images");
      return;
    }
    if (new Set(orders).size !== orders.length) {
      message.error("Order numbers must be unique");
      return;
    }
    if (orders.some((n) => n <= 0)) {
      message.error("Order numbers must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("file", file.originFileObj);
        }
      });
      formData.append("orders", JSON.stringify(orders));

      const postResponse = await postSildersContentService(formData);
      console.log("Post response:", postResponse);
      if (postResponse?.success) {
        presentToast.success("Images uploaded successfully!");
        setOrderInput("");
        setFileList([]);
        setPreviewOpen(false);
        setPreviewImage("");
      } else {
        presentToast.error(postResponse?.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      presentToast.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admindashboard-addproduct-card">
      <h2>Upload Slider Images</h2>

      <ImgCrop rotationSlider aspect={16 / 9}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          onPreview={handlePreview}
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          beforeUpload={() => false}
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
        value={orderInput}
        onChange={(e) => setOrderInput(e.target.value)}
        placeholder="Enter orders e.g. 1,2,3"
        style={{ marginTop: 20, width: "100%", padding: 10 }}
      />

      <div style={{ marginTop: 20 }}>
        <ContinueButton
          isLoading={loading}
          disabled={loading}
          onClick={handleSubmit}
          text="Submit Images"
        />
      </div>

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

// ---------- Delete Slider Card ----------
const DeleteSliderCard = () => {
  const [deleteInput, setDeleteInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const orders = parseCommaSeparated(deleteInput);
    if (orders.length === 0) {
      message.error("Enter at least one order number to delete");
      return;
    }

    try {
      setLoading(true);
      console.log("Deleting sliders:", orders);

      const listResp = await getSilderService();
      if (!listResp?.success) {
        presentToast.error(listResp?.message || "Failed to fetch sliders");
        return;
      }
      const sliders = listResp.data || [];

      const idsToDelete = orders.map((ord) => {
        const found = sliders.find((s) => Number(s.order) === Number(ord));
        return found?._id;
      });

      if (idsToDelete.some((id) => !id)) {
        presentToast.error(
          "One or more order numbers do not match existing sliders",
        );
        return;
      }

      const deleteResults = await Promise.all(
        idsToDelete.map((id) => deleteSildersContentService(id)),
      );

      if (deleteResults.every((r) => r?.success)) {
        presentToast.success("Images deleted successfully!");
        setDeleteInput("");
      } else {
        presentToast.error("Some deletions failed");
      }
    } catch (error) {
      console.error(error);
      presentToast.error("Delete failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admindashboard-addproduct-card" style={{ marginTop: 30 }}>
      <h2>Delete Slider Images</h2>
      <input
        type="text"
        value={deleteInput}
        onChange={(e) => setDeleteInput(e.target.value)}
        placeholder="e.g. 2,5,7"
        style={{ marginTop: 20, width: "100%", padding: 10 }}
      />
      <div style={{ marginTop: 20 }}>
        <ContinueButton
          isLoading={loading}
          disabled={loading}
          onClick={handleDelete}
          text="Delete Images"
        />
      </div>
    </div>
  );
};

// ---------- Rearrange Slider Card ----------

// ---------- Main Component ----------
const DashboardSliders = () => {
  return (
    <div style={{ padding: 20 }}>
      <UploadSliderCard />
      <DeleteSliderCard />
    </div>
  );
};

export default DashboardSliders;
