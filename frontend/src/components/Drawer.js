import React from "react";
import { Button, Drawer } from "antd";
import Sidebar from "./Sidebar";
import { MenuOutlined } from "@ant-design/icons";
const DrawerBar = ({ showDrawer, drawerVisible, onClose }) => {
  return (
    <div className="absolute top-8 left-4 z-20">
      {/* Floating Button */}
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={showDrawer}
      ></Button>

      <Sidebar visible={drawerVisible} onClose={onClose} />
    </div>
  );
};

export default DrawerBar;
