import type { CSSProperties } from 'react';

export interface ResponsiveStyle {
  mobile?: { style?: CSSProperties };
  tablet?: { style?: CSSProperties };
  desktop?: { style?: CSSProperties };
}

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

export type SizeVariant = 'sm' | 'md' | 'lg' | 'full';

export interface CommonNodeProps {
  variant?: string;
  size?: SizeVariant;
  colorVariant?: string;
  [key: string]: unknown;
}

export interface BaseNode {
  type: string;
  props?: CommonNodeProps;
  style?: CSSProperties;
  responsive?: ResponsiveStyle;
  children?: UINode[];
}

export interface TextNode extends BaseNode {
  type: 'text';
  props: CommonNodeProps & { value: string };
}

export interface ButtonNode extends BaseNode {
  type: 'button';
  props: CommonNodeProps & {
    label?: string;
    icon?: string;
    iconSize?: number;
    iconColor?: string;
    action?: Action;
    disabled?: boolean;
    disabledWhenFalse?: string;
  };
}

export interface InputNode extends BaseNode {
  type: 'input';
  props: CommonNodeProps & {
    placeholder?: string;
    inputType?: string;
    maxLength?: number;
  };
}

export interface DateInputNode extends BaseNode {
  type: 'date-input';
  props: CommonNodeProps & {
    placeholder?: string;
    maxLength?: number;
    icon?: string;
    inputStyle?: CSSProperties;
    iconButtonStyle?: CSSProperties;
  };
}

export interface OtpInputNode extends BaseNode {
  type: 'otp-input';
  props: CommonNodeProps & {
    length?: number;
    boxStyle?: CSSProperties;
  };
}

export interface CheckboxNode extends BaseNode {
  type: 'checkbox';
  props: CommonNodeProps & { label: string; stateKey: string };
}

export interface ContainerNode extends BaseNode {
  type: 'container';
  props?: CommonNodeProps & {
    selectable?: boolean;
    selectionKey?: string;
    value?: string;
  };
}

export interface ImageNode extends BaseNode {
  type: 'image';
  props: CommonNodeProps & { src: string; alt?: string };
}

export interface KycItemNode extends BaseNode {
  type: 'kyc-item';
  props: CommonNodeProps & {
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
  type: 'provider-group';
  props: CommonNodeProps & {
    title: string;
    items: ProviderItemProps[];
  };
}

export interface DynamicListNode extends BaseNode {
  type: 'dynamic-list';
  props: CommonNodeProps & {
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
