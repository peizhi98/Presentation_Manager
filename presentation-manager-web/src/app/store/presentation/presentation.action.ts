import {SupervisorModel} from '../../model/role/supervisor.model';
import {PanelModel} from '../../model/role/panel.model';
import {PresentationModel} from '../../model/presentation/presentation.model';

export class SetCurrentPresentation {
  static readonly type = '[Presentation] Set current presentation';

  constructor(public id: number, public presentationModel: PresentationModel, public supervisor: SupervisorModel, public panels: PanelModel[], public chairperson: PanelModel) {
  }
}
