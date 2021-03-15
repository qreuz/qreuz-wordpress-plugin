/** Material UI imports */
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress } from "@material-ui/core";

import { LocalContext } from './../qreuz-state-provider/context';

/**
 * Define local styles.
 */
const useStyles = makeStyles((theme) => ({
	linearProgress: {
		marginLeft: '-20px',
	}
}));

export default function QreuzLoading() {

	/**
	 * Load resources
	 */
		/** Load styles */
		const classes = useStyles();

		/** Load context */
		const { localStore } = React.useContext(
			LocalContext
		);

		/** Load state */
		const [showLinearProgress, setShowLinearProgress] = React.useState(false);

	/**
	 * useEffect on variable change.
	 * */
	React.useEffect(() => {

		setShowLinearProgress(true);

		if ( false === localStore.autosaving ) {
			const timer = setTimeout(function(){
				setShowLinearProgress(false);
			}, 2300);
			return() => clearTimeout(timer);
		}
	}, [localStore.autosaving]);

	if ( showLinearProgress ) {
		return(
			<LinearProgress className={classes.linearProgress} color="primary" />
		)
	} else {
		return null
	}
}
