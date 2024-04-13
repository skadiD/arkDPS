import {
    Appearance, Type
} from "./enmu";

interface ToastDismiss  {
    automatically: boolean;
    manually: boolean;
}

export interface Toast {
    id: string;
    message: string;
    type: Type;
    showIcon: boolean;
    dismiss: ToastDismiss;
    duration: number;
    showProgress: boolean;
    appearance: Appearance; // 背景 可选 Dark Light Glass
}