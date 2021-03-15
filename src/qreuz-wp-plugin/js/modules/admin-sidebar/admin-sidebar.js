/**
 * Basic imports/reqs.
 * */

/**
 * Material UI imports
 * */
import { makeStyles } from '@material-ui/core/styles';

/**
 * Import custom components.
 * */
import { GenericContext, LocalContext } from './../../components/qreuz-state-provider/context';
import { UserBox, GuestSidebar } from './../../components/qreuz-sidebar';

/**
 * Define local styles.
 */
const useStyles = makeStyles({
	root: {
	  maxWidth: 345,
	},
	media: {
	  height: 140,
	},
	cardHeader: {
		'& .MuiCardHeader-title': {
			fontFamily: 'inherit',
		},
		'& MuiCardHeader-subheader': {
			fontSize: '90%',
		},
	},
  });

const LoadUserSidebar = () => {

	return (
		<UserBox />
	);
}

/**
 * Export module: Admin sidebar
 */
export default function AdminSidebar(props) {

	/**
	 * Load context.
	 * */
	const { user, authKey, contextLoading, userPlan, isPropertyActive, message } = React.useContext(
		GenericContext
	);
	const { open } = React.useContext(
		LocalContext
	);

	/**
	 * Local state.
	 */
	

	/**
	 * Load local styles.
	 */
	const classes = useStyles();

	/**
	 * Handlers.
	 */
	

	/**
	 * useEffect on initial load.
	 * */
	React.useEffect(() => {

	}, []);

	/**
	 * Load sidebar content
	 */
	const LoadGuestSidebar = () => {

		return (
			<GuestSidebar />
		);
	}
	
	const LoadSidebarContent = () => {
	
		if ( true === user ) {
			return (
				<LoadUserSidebar />
			)
		} else {
			return(
				<LoadGuestSidebar />
			)
		}
	}

	return (
		<div id={'qreuz-admin-sidebar'}>
			<LoadSidebarContent />
		</div>
	)
}
