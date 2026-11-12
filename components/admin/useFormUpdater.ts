"use client";

import { useForm } from "@payloadcms/ui";
import { useCallback } from "react";

/* 自定义字段组件改值的统一入口。
   Payload 的 dispatchFields 只更新表单值，不会把表单标记成「已改动」，
   而右上角保存按钮的启用条件正是「已改动」——只 dispatch 的话值变了、按钮还是灰的，
   导出的自动保存也不会触发。所以每次写值都顺手 setModified(true)。 */
export const useFormUpdater = (): ((path: string, value: unknown) => void) => {
  const { dispatchFields, setModified } = useForm();

  return useCallback(
    (path: string, value: unknown) => {
      dispatchFields({ type: "UPDATE", path, value });
      setModified(true);
    },
    [dispatchFields, setModified],
  );
};
