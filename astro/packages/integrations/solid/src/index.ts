import type { AstroConfig, AstroIntegration, AstroRenderer } from 'astro';
import { getSolidPkgsConfig } from './dependencies.js';

function getRenderer(): AstroRenderer {
	return {
		name: '@astrojs/solid-js',
		clientEntrypoint: '@astrojs/solid-js/client.js',
		serverEntrypoint: '@astrojs/solid-js/server.js',
		jsxImportSource: 'solid-js',
		jsxTransformOptions: async ({ ssr }) => {
			// @ts-expect-error types not found
			const [{ default: solid }] = await Promise.all([import('babel-preset-solid')]);
			const options = {
				presets: [solid({}, { generate: ssr ? 'ssr' : 'dom', hydratable: true })],
				plugins: [],
				// Otherwise, babel will try to consume the source map generated by esbuild
				// This causes unexpected issues with newline characters: https://github.com/withastro/astro/issues/3371
				// Note "vite-plugin-solid" does the same: https://github.com/solidjs/vite-plugin-solid/blob/master/src/index.ts#L344-L345
				inputSourceMap: false as any,
			};

			return options;
		},
	};
}

async function getViteConfiguration(isDev: boolean, astroConfig: AstroConfig) {
	// https://github.com/solidjs/vite-plugin-solid
	// We inject the dev mode only if the user explicitly wants it or if we are in dev (serve) mode
	const nestedDeps = ['solid-js', 'solid-js/web', 'solid-js/store', 'solid-js/html', 'solid-js/h'];
	const solidPkgsConfig = await getSolidPkgsConfig(!isDev, astroConfig);
	return {
		/**
		 * We only need esbuild on .ts or .js files.
		 * .tsx & .jsx files are handled by us
		 */
		esbuild: { include: /\.ts$/ },
		resolve: {
			conditions: ['solid', ...(isDev ? ['development'] : [])],
			dedupe: nestedDeps,
			alias: [{ find: /^solid-refresh$/, replacement: '/@solid-refresh' }],
		},
		optimizeDeps: {
			include: [...nestedDeps, ...solidPkgsConfig.optimizeDeps.include],
			exclude: ['@astrojs/solid-js/server.js', ...solidPkgsConfig.optimizeDeps.exclude],
		},
		ssr: {
			external: ['babel-preset-solid', ...solidPkgsConfig.ssr.external],
			noExternal: [...solidPkgsConfig.ssr.noExternal],
		},
	};
}

export default function (): AstroIntegration {
	return {
		name: '@astrojs/solid-js',
		hooks: {
			'astro:config:setup': async ({ command, addRenderer, updateConfig, config }) => {
				addRenderer(getRenderer());
				updateConfig({ vite: await getViteConfiguration(command === 'dev', config) });
			},
		},
	};
}