/**
 * Basic imports/reqs.
 * */
const { render } = wp.element;
import React, { Suspense } from 'react';

/**
 * Import custom components.
 * */
import { GenericProvider, LocalProvider } from './components/qreuz-state-provider';

/**
 * Basic suspense loader.
 * */
const basicSuspense = () => <p>Loading...</p>;

/**
 * Load admin pages content.
 * */
const ModuleAdminPbContent = React.lazy(() => import('./modules/module-admin-pb-content'));

/**
 * Import admin styles
 * */
import '../css/qreuz-wp-plugin-admin.scss';

/**
 * Load admin pages content.
 * 
 * Will be loaded for {div id="qreuz_admin_pb_content"}
 * 
 * @props
 */
function LoadModuleAdminPbContent(props) {

	return(
		<React.Fragment>
			<Suspense fallback={basicSuspense()}>
				<GenericProvider {...props}>
					<LocalProvider {...props}>
						<ModuleAdminPbContent {...props} />
					</LocalProvider>
				</GenericProvider>
			</Suspense>	
		</React.Fragment>
	)
}
if (document.getElementById('qreuz_admin_pb_content')) {
	const domContainer = document.querySelector('#qreuz_admin_pb_content');
	render(<LoadModuleAdminPbContent {...domContainer.dataset} />, document.getElementById('qreuz_admin_pb_content'));
}
