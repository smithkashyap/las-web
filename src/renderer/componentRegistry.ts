import type { ComponentType } from 'react';
import { Container } from '../components/Container';
import { Text } from '../components/Text';
import { Image } from '../components/Image';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { OtpInput } from '../components/OtpInput';
import { Checkbox } from '../components/Checkbox';
import { DateInput } from '../components/DateInput';
import { StateSwitch } from '../components/StateSwitch';
import { KycItem } from '../components/KycItem';
import { ProviderItem } from '../components/ProviderItem';
import { ProviderGroup } from '../components/ProviderGroup';
import { PledgeCard } from '../components/PledgeCard';
import { DynamicList } from '../components/DynamicList';
import { TabBar } from '../components/TabBar';
import { ValueSwitch } from '../components/ValueSwitch';
import { ExpandableList } from '../components/ExpandableList';
import { HoldingCard } from '../components/HoldingCard';
import type { UINode } from './types';
import { SelectableList } from '../components/SelectableList';
import { PaginatedList } from '../components/PaginatedList';
import { InfiniteSelectableList } from '../components/InfiniteSelectableList';

export const componentRegistry: Record<string, ComponentType<{ node: UINode }>> = {
  container: Container,
  text: Text,
  image: Image,
  button: Button,
  input: Input,
  'otp-input': OtpInput,
  checkbox: Checkbox,
  'date-input': DateInput,
  'state-switch': StateSwitch,
  'kyc-item': KycItem,
  'provider-item': ProviderItem,
  'provider-group': ProviderGroup,
  'pledge-card': PledgeCard,
  'dynamic-list': DynamicList,
  'tab-bar': TabBar,
  'value-switch': ValueSwitch,
  'expandable-list': ExpandableList,
  'paginated-list': PaginatedList,
  'holding-card': HoldingCard,
  'selectable-list': SelectableList,
  'infinite-selectable-list': InfiniteSelectableList
};
