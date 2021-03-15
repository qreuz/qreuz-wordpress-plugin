import { useForm } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import { LocalContext } from '../qreuz-state-provider/context';

const TextFieldAutosave = ({
		name,
		id,
		label,
		error,
		control,
		defaultValue,
		required,
		saveOnChange = true,
		endAdornment,
		helperText,
		localStoreData,
		children,
		...props
	}) => {

		/** Load context */
		const { localStore, setLocalStore } = React.useContext(
			LocalContext
		);

		/** Local state */
		const [newValue, setNewValue] = React.useState(defaultValue);

		/** react-hook-form */
		const { handleSubmit, register, reset, formState:{errors} } = useForm();
	
	/**
	 * Handlers
	 */
		/** Save on change */
		const handleInputChange = (e) => {
			setNewValue(e.target.value);
		}

		/** Actually save the form */
		const saveNow = (newValue) => {

			/** Determine if we need to save changes */
			if (saveOnChange) {

				/** Get depth of localStoreData section */
				let depthObj = localStoreData.section.split(".");

				switch ( depthObj.length ) {
					case 1:
						setLocalStore({
							...localStore,
							[localStoreData.section]: {
								...localStore[localStoreData.section],
								[localStoreData.data]: newValue
							}
						});
						break;
					case 2:
						setLocalStore({
							...localStore,
							[depthObj[0]]: {
								...localStore[depthObj[0]],
								[depthObj[1]]: {
									...localStore[depthObj[0]][depthObj[1]],
									[localStoreData.data]: newValue,
								},
							},
						});
						break;
					case 3:
						setLocalStore({
							...localStore,
							[depthObj[0]]: {
								...localStore[depthObj[0]],
								[depthObj[1]]: {
									...localStore[depthObj[0]][depthObj[1]],
									[depthObj[2]]: {
										...localStore[depthObj[0]][depthObj[1]][depthObj[2]],
										[localStoreData.data]: newValue,
									},
								},
							},
						});
						break;
					default:
						console.log('An error occured');
						break;
				}
			}
		}

		React.useEffect(() => {
			if ( newValue !== defaultValue ){
					saveNow(newValue);
			}
		}, [newValue]);
		
		/**
		 * Return for TextFieldAutosave
		 */
		return (
			<form 
				id={name}
				onSubmit={handleSubmit((e) => saveNow(newValue))}
				noValidate
				autoComplete="off"
				>
				<TextField 
					inputRef={register({required:false})}
					name={name}
					id={id}
					type="text"
					label={name}
					formState={{errors:error}}
					defaultValue={defaultValue}
					onChange={(e) => {handleInputChange(e)}}
					InputProps={{
						endAdornment:<InputAdornment position="end">{endAdornment}</InputAdornment>,
						name:name,
						id:id,
						required:required
					}}
					disabled={localStore.autosaving}
					helperText={helperText}
					/>
			</form>
		);
};
export default TextFieldAutosave;
