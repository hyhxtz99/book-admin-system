import { Spin } from "antd";
import React from "react";

interface LoadingSpinnerProps {
  tip?: string;
  size?: "small" | "default" | "large";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  tip = "Loading...", 
  size = "default" 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '200px',
      width: '100%'
    }}>
      <Spin tip={tip} size={size} />
    </div>
  );
};

export default LoadingSpinner;
