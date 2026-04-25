import { componentRegistry } from './componentRegistry';
import type { UINode } from './types';

export type Scope = Record<string, string>;

function interpolate(value: string, scope: Scope): string {
  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => scope[key] ?? `{{${key}}}`);
}

function applyScope(node: UINode, scope: Scope): UINode {
  if (!Object.keys(scope).length) return node;

  const patched = { ...node };

  if (patched.props) {
    const newProps = { ...patched.props } as Record<string, unknown>;
    if (typeof newProps['value'] === 'string') {
      newProps['value'] = interpolate(newProps['value'], scope);
    }
    patched.props = newProps as typeof patched.props;
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
