import produce, { Draft } from 'immer';

export const stateRootKey = 'pluginSystem';

export const defaultState = {
	plugins: {},
};

const reducer = produce((draft: Draft<any>, action:any) => {
	if (action.type.indexOf('PLUGIN_') !== 0) return;

	// All actions should be scoped to a plugin, except when adding a new plugin
	if (!action.pluginId && action.type !== 'PLUGIN_ADD') throw new Error(`action.pluginId is required. Action was: ${JSON.stringify(action)}`);

	try {
		switch (action.type) {

		case 'PLUGIN_ADD':

			if (draft.pluginSystem.plugins[action.plugin.id]) throw new Error(`Plugin is already loaded: ${JSON.stringify(action)}`);
			draft.pluginSystem.plugins[action.plugin.id] = action.plugin;
			break;

		case 'PLUGIN_CONTROL_ADD':

			draft.pluginSystem.plugins[action.pluginId].controls[action.control.id] = { ...action.control };
			break;

		case 'PLUGIN_CONTROL_PROP_SET':

			draft.pluginSystem.plugins[action.pluginId].controls[action.id][action.name] = action.value;
			break;

		}
	} catch (error) {
		error.message = `In plugin reducer: ${error.message} Action: ${JSON.stringify(action)}`;
		throw error;
	}
});

export default reducer;