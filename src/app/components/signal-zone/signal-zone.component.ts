import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ZoneService} from "../../services/zone.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-signal-zone',
  templateUrl: './signal-zone.component.html',
  styleUrls: ['./signal-zone.component.css']
})
export class SignalZoneComponent implements OnInit {

  isSignalZoneClickedValue: boolean;

  get isSignalZoneClicked(): boolean {
    return this.isSignalZoneClickedValue;
  }

  @Input() set isSignalZoneClicked(value: boolean) {
    this.isSignalZoneClickedValue = value;
    this.isSignalZoneClickedChange.emit(this.isSignalZoneClickedValue);
  }

  @Output() isSignalZoneClickedChange = new EventEmitter<boolean>();

  filteredItems: any[];
  pollutionLevelItems: any[] = ['Faible', 'Moyen', 'Elevé'];

  registerForm: FormGroup;
  loading = "";

  uploadedFiles: any[];

  constructor(private fb: FormBuilder,
              private zoneService: ZoneService,
              private messageService: MessageService) {
    this.registerForm = this.fb.group({
      'zoneStreet': ['', Validators.required],
      'zoneCity': ['', Validators.required],
      'zoneZipcode': ['', [Validators.pattern('[0-9]{5}'), Validators.required]],
      'zoneDescription': ['', Validators.required],
      'zonePollutionLevel': ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.uploadedFiles = [];
  }

  async signalZone() {
    this.loading = "chargement...";
    if (this.uploadedFiles.length === 0) {
      this.messageService.add({severity: 'warn', summary: 'Conflit', detail: 'Veuillez saisir au moins 1 image.'});
      this.loading = "";
      return;
    }
    const zone = await this.zoneService.signalZone(this.registerForm.value);
    this.uploadedFiles.forEach(async (file) => {
      await this.zoneService.addPictureToZone(zone.zoneId, file.name);
      //TODO mettre les fichiers uploadés dans assets
    });
    this.loading = "";
    this.isSignalZoneClickedChange.emit(false);
    this.messageService.add({severity: 'warn', summary: 'Signalé', detail: 'Lieu signalé avec succès ! Il doit maintenant être validé par notre équipe.'});
  }

  filterItems(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.pollutionLevelItems.length; i++) {
      let item = this.pollutionLevelItems[i];
      if (item.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.filteredItems = filtered;
  }

  onSelect(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

}
