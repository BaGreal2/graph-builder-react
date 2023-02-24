import { SaveIcon } from '../../assets/fonts/icons';
import ToolBtn from './ToolBtn';

function SaveBtn({ tooltipText, onShowChoice, children }) {
	return (
		<ToolBtn tooltipText={tooltipText} onClick={onShowChoice} active={true}>
			<SaveIcon />
			{children}
		</ToolBtn>
	);
}

export default SaveBtn;
