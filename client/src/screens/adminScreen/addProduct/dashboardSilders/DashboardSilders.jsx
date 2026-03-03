import React, { useState } from "react";
import { Upload, Modal, message } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import ContinueButton from "../../../../components/buttons/ContinueButton";

/* =========================================================
   Utility Functions
========================================================= */

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const parseCommaSeparated = (input) => {
  if (!input.trim()) return [];
  return input
    .split(",")
    .map((num) => parseInt(num.trim(), 10))
    .filter((n) => !isNaN(n));
};

/* =========================================================
   Custom Hook - File Upload Management
========================================================= */

const useFileUpload = (initialFileList = []) => {
  const [fileList, setFileList] = useState(initialFileList);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

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

  const closePreview = () => setPreviewOpen(false);

  return {
    fileList,
    previewOpen,
    previewImage,
    handlePreview,
    handleChange,
    closePreview,
  };
};

/* =========================================================
   Preview Modal
========================================================= */

const PreviewModal = ({ open, image, onCancel }) => (
  <Modal open={open} footer={null} onCancel={onCancel}>
    <img alt="preview" style={{ width: "100%" }} src={image} />
  </Modal>
);

/* =========================================================
   Upload Slider Card
========================================================= */

const UploadSliderCard = () => {
  const {
    fileList,
    previewOpen,
    previewImage,
    handlePreview,
    handleChange,
    closePreview,
  } = useFileUpload();

  const [orderInput, setOrderInput] = useState("");
  const [loading, setLoading] = useState(false);

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

      console.log("Uploading sliders:", orders);
      // await api.post("/sliders/upload", formData);

      message.success("Images uploaded successfully!");
      setOrderInput("");
    } catch (error) {
      console.error(error);
      message.error("Upload failed!");
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

      <PreviewModal
        open={previewOpen}
        image={previewImage}
        onCancel={closePreview}
      />
    </div>
  );
};

/* =========================================================
   Delete Slider Card
========================================================= */

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
      // await api.delete("/sliders", { data: { orders } });

      message.success("Images deleted successfully!");
      setDeleteInput("");
    } catch (error) {
      console.error(error);
      message.error("Delete failed!");
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

/* =========================================================
   Rearrange Slider Card (NO RE-UPLOAD)
========================================================= */

const RearrangeSliderCard = () => {
  // Simulated backend data
  const [sliders] = useState([
    { id: 1, imageUrl: "https://picsum.photos/200/300", order: 1 },
    { id: 2, imageUrl: "https://picsum.photos/200/300", order: 2 },
    { id: 3, imageUrl: "https://picsum.photos/200/300", order: 3 },
  ]);

  const [orderInput, setOrderInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRearrange = async () => {
    const newOrders = parseCommaSeparated(orderInput);

    if (newOrders.length !== sliders.length) {
      message.error("Order count must match number of existing sliders");
      return;
    }

    if (new Set(newOrders).size !== newOrders.length) {
      message.error("Order numbers must be unique");
      return;
    }

    try {
      setLoading(true);

      const payload = sliders.map((slider, index) => ({
        id: slider.id,
        newOrder: newOrders[index],
      }));

      console.log("Reorder payload:", payload);
      // await api.put("/sliders/reorder", payload);

      message.success("Images rearranged successfully!");
      setOrderInput("");
    } catch (error) {
      console.error(error);
      message.error("Rearrangement failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admindashboard-addproduct-card" style={{ marginTop: 30 }}>
      <h2>Rearrange Slider Images</h2>

      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        {sliders.map((slider) => (
          <div key={slider.id}>
            <img
              src={slider.imageUrl}
              alt="slider"
              style={{ width: 120, height: 80, objectFit: "cover" }}
            />
            <p style={{ textAlign: "center" }}>Current: {slider.order}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={orderInput}
        onChange={(e) => setOrderInput(e.target.value)}
        placeholder="e.g. 3,1,2"
        style={{ marginTop: 20, width: "100%", padding: 10 }}
      />

      <div style={{ marginTop: 20 }}>
        <ContinueButton
          isLoading={loading}
          disabled={loading}
          onClick={handleRearrange}
          text="Submit Rearrangement"
        />
      </div>
    </div>
  );
};

/* =========================================================
   Main Component
========================================================= */

const DashboardSliders = () => {
  return (
    <div style={{ padding: 20 }}>
      <UploadSliderCard />
      <DeleteSliderCard />
      <RearrangeSliderCard />
    </div>
  );
};

export default DashboardSliders;
