import { componentRegistry } from './componentRegistry';
import type { UINode } from './types';

export type Scope = Record<string, string | number | boolean>;

function resolveString(value: string, scope: Scope) {
  const exactMatch = value.match(/^\{\{(\w+)\}\}$/);
  const exactKey = exactMatch?.[1];
  if (exactKey) {
    const scopedValue = scope[exactKey];
    return scopedValue ?? value;
  }

  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => String(scope[key] ?? `{{${key}}}`));
}

function resolveScopeValue(value: unknown, scope: Scope): unknown {
  if (typeof value === 'string') return resolveString(value, scope);
  if (Array.isArray(value)) return value.map((item) => resolveScopeValue(item, scope));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, resolveScopeValue(nestedValue, scope)]),
    );
  }
  return value;
}

function applyScope(node: UINode, scope: Scope): UINode {
  if (!Object.keys(scope).length) return node;
  const patched = { ...node };

  if (patched.props) {
    patched.props = resolveScopeValue(patched.props, scope) as typeof patched.props;
  }

  if (patched.children) {
    patched.children = patched.children.map((child) => applyScope(child, scope));
  }

  return patched;
}

interface DynamicRendererProps {
  node: UINode;
  scope?: Scope;
}

export function DynamicRenderer({ node, scope = {} }: DynamicRendererProps) {
  const resolved = applyScope(node, scope);
  const Component = componentRegistry[resolved.type];
  if (!Component) return null;
  return <Component node={resolved} />;
}
