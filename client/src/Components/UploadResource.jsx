import "./UploadResource.css";
import { Upload, Button, Input, Tabs } from "antd";
import {
  UploadOutlined,
  FileOutlined,
  PictureOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
const { TextArea } = Input;
const items = [
  {
    key: "1",
    label: "Upload",
    children: (
      <div style={{ marginTop: "20px" }}>
        <h3>Upload New Resources</h3>
        <Upload>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
            <p>PDF,DOC,PPT</p>
          </div>
        </Upload>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <Upload accept=".pdf,.doc,.docx,.txt">
            <Button icon={<FileOutlined />}>document</Button>
          </Upload>
          <Upload accept="image/*">
            <Button icon={<PictureOutlined />}>image</Button>
          </Upload>
          <Upload accept="audio/*">
            <Button icon={<SoundOutlined />}>audio</Button>
          </Upload>
          <Upload accept="video/*">
            <Button icon={<VideoCameraOutlined />}>video</Button>
          </Upload>
        </div>
        <div style={{ marginTop: "20px" }}>
          <p>Title</p>
          <Input placeholder="Resource Title" style={{ padding: "8px" }} />
        </div>
        <div style={{ marginTop: "20px" }}>
          <p>Description</p>
          <TextArea placeholder="Resource Description" rows={4} />
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Button>cancel</Button>
          <Button type="primary">upload</Button>
        </div>
      </div>
    ),
  },
  {
    key: "2",
    label: "Recent Uploads",
    children: <div style={{ marginTop: "20px" }}></div>,
  },
];
const UploadResource = () => {
  return (
    <div className="uploadResource">
      <h2>Resources</h2>
      <Tabs defaultActiveKey="1" items={items}></Tabs>
    </div>
  );
};

export default UploadResource;
