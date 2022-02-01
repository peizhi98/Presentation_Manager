import {Component, OnInit} from '@angular/core';
import {PresentationService} from '../../../../service/presentation.service';
import {Constant} from '../../../../../assets/constant/app.constant';
import {PresentationModel} from '../../../../model/presentation/presentation.model';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  firstLoadPaneling = true;
  panelingPresentations: PresentationModel[];

  firstLoadSupervising = true;
  supervisingPresentations: PresentationModel[];

  firstLoadPresiding = true;
  presidingPresentations: PresentationModel[];

  constructor(private presentationService: PresentationService, private loadingDialogUtil: LoadingDialogUtil) {
  }

  ngOnInit(): void {
  }

  loadPanelingPresentations(): void {
    if (this.firstLoadPaneling) {
      const loading = this.loadingDialogUtil.openLoadingDialog();
      this.presentationService.getPresentationsAsPanel().subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.panelingPresentations = resp.data;
          this.firstLoadPaneling = false;
          loading.close();
        }
      });
    }

  }

  loadSupervisingPresentations(): void {
    if (this.firstLoadSupervising) {
      const loading = this.loadingDialogUtil.openLoadingDialog();
      this.presentationService.getPresentationsAsSupervisor().subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.supervisingPresentations = resp.data;
          this.firstLoadSupervising = false;
          loading.close();
        }
      });
    }
  }

  loadPresidingPresentations(): void {
    if (this.firstLoadPresiding) {
      const loading = this.loadingDialogUtil.openLoadingDialog();
      this.presentationService.getPresentationsAsChairperson().subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.presidingPresentations = resp.data;
          this.firstLoadPresiding = false;
          loading.close();
        }
      });
    }
  }


}
