import { SaveIcon } from '../../assets/icons';
import ToolBtn from './ToolBtn';

function SaveBtn({ downloadUrl, onSaveGraph }) {
	return (
		<a download={'graph.json'} href={downloadUrl}>
			<ToolBtn onClick={onSaveGraph} active={true}>
				<SaveIcon />
			</ToolBtn>
		</a>
	);
}

export default SaveBtn;
