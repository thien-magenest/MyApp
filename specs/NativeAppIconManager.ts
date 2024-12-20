import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  changeTo(appIconId: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAppIconManager');
