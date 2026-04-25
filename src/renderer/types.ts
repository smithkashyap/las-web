import type { CSSProperties } from 'react';

export interface NavigateAction {
  type: 'navigate';
  payload: { route: string };
}

export interface GoBackAction {
  type: 'goBack';
}

export interface SetStateAction {
  type: 'setState';
  payload: { key: string; value: boolean | string };
}

export interface ApiAction {
  type: 'api';
  payload: {
    api: string;
    body?: Record<string, unknown>;
    onSuccess?: Action;
    onError?: Action;
  };
}

export type Action =
  | NavigateAction
  | GoBackAction
  | SetStateAction
  | ApiAction;

export interface BaseNode {
  type: string;
  props?: Record<string, unknown>;
  style?: CSSProperties;
  children?: UINode[];
}

export interface TextNode extends BaseNode {
  type: 'text';
  props: { value: string; variant?: string };
}

export interface ButtonNode extends BaseNode {
  type: 'button';
  props: {
    label?: string;
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    action?: Action;
    disabledWhenEmpty?: string;
    disabledWhenFalse?: string;
  };
}

export interface InputNode extends BaseNode {
  type: 'input';
  props: {
    placeholder?: string;
    inputType?: string;
    maxLength?: number;
  };
}

export interface DateInputNode extends BaseNode {
  type: 'date-input';
  props: {
    placeholder?: string;
    maxLength?: number;
    icon?: string;
    inputStyle?: CSSProperties;
    iconButtonStyle?: CSSProperties;
  };
}

export interface OtpInputNode extends BaseNode {
  type: 'otp-input';
  props: {
    length?: number;
    boxStyle?: CSSProperties;
  };
}

export interface CheckboxNode extends BaseNode {
  type: 'checkbox';
  props: { label: string; stateKey: string };
}

export interface ContainerNode extends BaseNode {
  type: 'container';
  props?: {
    selectable?: boolean;
    selectionKey?: string;
    value?: string;
  };
}

export interface ImageNode extends BaseNode {
  type: 'image';
  props: { src: string; alt?: string };
}

export interface KycItemNode extends BaseNode {
  type: 'kycItem';
  props: {
    icon: string;
    title: string;
    subtitle: string;
    status?: 'done' | 'pending';
    action?: Action;
    stateKey?: string;
  };
}

export interface ProviderItemProps {
  name: string;
  code: string;
  color: string;
  status: 'connected' | 'not_connected';
  action?: Action;
}

export interface ProviderGroupNode extends BaseNode {
  type: 'providerGroup';
  props: {
    title: string;
    items: ProviderItemProps[];
  };
}

export interface DynamicListNode extends BaseNode {
  type: 'dynamicList';
  props: {
    itemType: string;
    items: Record<string, unknown>[];
    extraProps?: Record<string, unknown>;
  };
}

export type UINode =
  | TextNode
  | ButtonNode
  | InputNode
  | DateInputNode
  | OtpInputNode
  | CheckboxNode
  | ContainerNode
  | ImageNode
  | KycItemNode
  | ProviderGroupNode
  | DynamicListNode
  | BaseNode;
