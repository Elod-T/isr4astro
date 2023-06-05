export {
	createDefaultDevConfig,
	openConfig,
	resolveConfigPath,
	resolveFlags,
	resolveRoot,
	validateConfig,
} from './config.js';
export type { AstroConfigSchema } from './schema.js';
export { createDefaultDevSettings, createSettings } from './settings.js';
export { loadTSConfig, updateTSConfigForFramework } from './tsconfig.js';
