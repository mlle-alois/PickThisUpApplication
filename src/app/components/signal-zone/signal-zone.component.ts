
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Component, Input, OnInit, Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {ZoneService} from "../../services/zone.service";

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

  pollutionLevel: string;
  filteredItems: any[];
  pollutionLevelItems: any[] = [{label: 'Faible', value: '1'}, {label: 'Moyen', value: '2'}, {label: 'Elevé', value: '3'}];

  registerForm: FormGroup;
  message: any;
  loading = "";

  uploadedFiles: any[];

  constructor(private fb: FormBuilder,
              private zoneService: ZoneService) {
    this.registerForm = this.fb.group({
      'adress': ['', Validators.required],
      'city': ['', Validators.required],
      'zipcode': ['', [Validators.pattern('[0-9]{5}'), Validators.required]],
      'description': ['', Validators.required],
      'pollutionLevel': ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.uploadedFiles = [];
  }

  signalZone() {
    this.message = "";
    this.loading = "chargement...";
    if(this.uploadedFiles.length === 0) {
      this.message = "Veuillez saisir au moins 1 image.";
      this.loading = "";
      return;
    }
    this.zoneService.signalZone(this.registerForm.value);

  }

  filterItems(event) {
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.pollutionLevelItems.length; i++) {
      let item = this.pollutionLevelItems[i];
      if (item.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.filteredItems = filtered;
  }

  onSelect(event) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
  }

}
