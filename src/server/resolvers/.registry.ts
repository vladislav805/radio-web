import type { IResolverCtr } from '../Resolver';
import { DfmResolver } from './dfm';
import { DorozhnoeResolver } from './dorozhnoe';
import { Emg7Resolver } from './emg_7';
import { EmgEuropaPlusResolver } from './europaplus';
import { PiterFmResolver } from './piterfm';
import { RecordResolver } from './record';

export const resolversRegistry = new Map<string, IResolverCtr<object>>();

resolversRegistry.set('record', RecordResolver);
resolversRegistry.set('emg/europa', EmgEuropaPlusResolver);
resolversRegistry.set('emg/7', Emg7Resolver);
resolversRegistry.set('dfm', DfmResolver);
resolversRegistry.set('piter', PiterFmResolver);
resolversRegistry.set('dorozhnoe', DorozhnoeResolver);
