import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { Controller, useForm } from "react-hook-form";

import { LocalContext } from '../qreuz-state-provider/context';

const SelectAutosave = ({
		name,
		label,
		control,
		defaultValue,
		saveOnChange = true,
		localStoreData,
		children,
		...props
	}) => {

		/** Load context */
		const { localStore, setLocalStore } = React.useContext(
			LocalContext
		);

		/** Local state */


		/** react-hook-form */
		const { handleSubmit } = useForm();

		/** Save on change */
		const onChange = (e) => {

			/** Determine if we need to save changes */
			if (saveOnChange) {
	
				setLocalStore({
					...localStore,
					[localStoreData.section]: {
						...localStore[localStoreData.section],
						[e.target.name]: e.target.value
					}
				});

			}
		}
		
		const labelId = `${name}-label`;

		return (
			<form 
				id={name}
				onSubmit={handleSubmit(onChange)}
				noValidate
				autoComplete="off"
				>
				<FormControl {...props}>
					<InputLabel
						id={labelId}
						>
						{label}
					</InputLabel>
					<Controller
						render={(...props) => (
								<Select
									labelId={labelId}
									label={label}
									name={name}
									id={name}
									inputProps={{
										name: name,
									}}
									defaultValue={defaultValue}
									onChange={(e) => {
										onChange(e)
									}}
									>
									{children}
								</Select>
							)
						}
						name={name}
						control={control}
						defaultValue={defaultValue}
					/>
				</FormControl>
			</form>
		);
};
export default SelectAutosave;
