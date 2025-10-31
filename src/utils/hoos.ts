import { UserType } from "@/types";
import { useEffect, useState, useRef, useCallback } from "react";

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    const obj = localStorage.getItem("user");
    if (obj) {
      console.log(
        "%c [ obj ]-9",
        "font-size:13px; background:pink; color:#bf2c9f;",
        obj
      );
      setUser(JSON.parse(obj));
    }
  }, []);

  return user;
};

// 防抖函数hook - 用于按钮点击等操作
export const useDebounceCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// 防抖值hook - 用于搜索输入等
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 模态框管理hook
export const useModal = (initialVisible: boolean = false) => {
  const [visible, setVisible] = useState(initialVisible);
  const [loading, setLoading] = useState(false);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);
  const toggle = useCallback(() => setVisible(prev => !prev), []);

  const showWithLoading = useCallback(() => {
    setLoading(true);
    setVisible(true);
  }, []);

  const hideWithLoading = useCallback(() => {
    setLoading(false);
    setVisible(false);
  }, []);

  return {
    visible,
    loading,
    show,
    hide,
    toggle,
    showWithLoading,
    hideWithLoading,
  };
};
