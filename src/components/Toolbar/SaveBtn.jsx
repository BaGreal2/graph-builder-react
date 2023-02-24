import { SaveIcon } from '../../assets/icons';
import ToolBtn from './ToolBtn';

function SaveBtn({ onShowChoice, children }) {
	return (
		<ToolBtn onClick={onShowChoice} active={true}>
			<SaveIcon />
			{children}
		</ToolBtn>
	);
}

export default SaveBtn;
