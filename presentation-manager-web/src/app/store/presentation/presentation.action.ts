import {SupervisorModel} from '../../model/role/supervisor.model';
import {PanelModel} from '../../model/role/panel.model';

export class SetCurrentPresentation {
  static readonly type = '[Presentation] Set current presentation';

  constructor(public id: number, public supervisor: SupervisorModel, public panels: PanelModel[]) {
  }
}
