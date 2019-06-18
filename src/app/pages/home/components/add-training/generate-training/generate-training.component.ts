import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../../../services/data.service';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {TrainingDay, TrainingDayWorkout, Workout} from '../../../../../resources/ApiClient';
import {DataFactory} from '../../../../../resources/factory';

@Component({
  selector: 'app-generate-training',
  templateUrl: './generate-training.component.html',
  styleUrls: ['./generate-training.component.scss'],
})
export class GenerateTrainingComponent implements OnInit {

  public name : string = "";
  public countDays : number = 1;
  public days : TrainingDay[] = [];
  public selectedWorkouts: Workout[];
  public generatedWorkouts: Workout[];
  public dayName: string;
  public selectedGoal: string;
  public selectedExperience: string;
  isExperienced: boolean;
  
  public get Workouts() {
    return this._dataService.Workouts;
  }
  public get InputsValid() {
    return this.dayName != null && this.dayName.length > 0 && this.selectedWorkouts != null && this.selectedWorkouts.length > 0;
  }

  constructor(private _dataService: DataService, private _router: Router, public toastController: ToastController) { }

  ngOnInit() {}

  async onCreateTraining() {
    console.log("IsExperienced" + this.isExperienced);
    if(this.countDays < 1 || this.countDays > 7) {
      await this.presentWarningToast();
    }
    else if(this.selectedGoal!=null){
      this.generateTraining();
      await this._router.navigateByUrl("/change");
    }
  }

  async presentWarningToast() {
    const toast = await this.toastController.create({
      message: 'Die Anzahl der Tage muss zwischen 1 und 7 liegen',
      duration: 2000
    });
    toast.present();
  }

  async presentSuccessToast(plan: string) {
    const successToast = await this.toastController.create({
      message: 'Dein neuer Trainingsplan lautet: ' + plan,
      duration: 4000
    });
    successToast.present();
  }

  generateTraining() {
    if (!this.isExperienced) {
      if(this.countDays < 4){
        this.generateBeginnerGK();
      }
      else if(this.countDays < 6){
        this.generateBeginnerOKUK();
      }
      else {
        this.generateBeginnerPPB();
      }
    }
    else {
      if (this.countDays < 4) {
        this.generateAdvancedGK();
      }
      else if (this.countDays < 6) {
        this.generateAdvancedOKUK();
      }
      else {
        this.generateAdvancedPPB();
      }
    }
  }

  async generateBeginnerGK() {
    let generatedWorkouts: Workout[] = [
      this.findWorkoutByName('Beinstreckermaschine'),
      this.findWorkoutByName('Rudermaschine'),
      this.findWorkoutByName('Latzugmaschine'),
      this.findWorkoutByName('Brustpresse'),
      this.findWorkoutByName('Schulterpresse Maschine'),
      this.findWorkoutByName('Beinpresse')
    ];
    const newDay = DataFactory.createTrainingDay('Ganzkörpertraining', generatedWorkouts);
    this.days.push(newDay);
    this.presentSuccessToast('Ganzkörpertraining für Beginner');
    await this._dataService.createTrainingPlan(DataFactory.createTrainingPlan('Ganzkörpertraining Beginner', this.days));
  }

  async generateBeginnerOKUK() {
    let upperBodyWorkouts: Workout[] = [
      this.findWorkoutByName('Brustpresse'),
      this.findWorkoutByName('Butterfly'),
      this.findWorkoutByName('Rudermaschine'),
      this.findWorkoutByName('Latzugmaschine'),
      this.findWorkoutByName('Bizepsmaschine'),
      this.findWorkoutByName('Trizepsmaschine')
    ];

    let lowerBodyWorkouts: Workout[] = [
      this.findWorkoutByName('Wadenheben'),
      this.findWorkoutByName('Beinpresse'),
      this.findWorkoutByName('Beinstreckermaschine'),
      this.findWorkoutByName('Beinbeugermaschine'),
      this.findWorkoutByName('Rückenstrecker'),
    ];
    const upperBody = DataFactory.createTrainingDay('Oberkörper', upperBodyWorkouts);
    const lowerBody = DataFactory.createTrainingDay('Unterkörper', lowerBodyWorkouts);
    this.days.push(upperBody, lowerBody);
    this.presentSuccessToast('2er Split für Beginner');
    await this._dataService.createTrainingPlan(DataFactory.createTrainingPlan('2er Split Beginner', this.days));
  }

  async generateBeginnerPPB() {
    let pushWorkouts: Workout[] = [
      this.findWorkoutByName('Brustpresse'),
      this.findWorkoutByName('Butterfly'),
      this.findWorkoutByName('Trizepsmaschine'),
      this.findWorkoutByName('Bauchmaschine'),
      this.findWorkoutByName('Seithebemaschine'),
      this.findWorkoutByName('Kurzhantel Schulterpresse')
    ];

    let pullWorkouts: Workout[] = [
      this.findWorkoutByName('Rudermaschine'),
      this.findWorkoutByName('Latzugmaschine'),
      this.findWorkoutByName('Bizepsmaschine'),
      this.findWorkoutByName('Rückenstrecker'),
      this.findWorkoutByName('Bizepscurls SZ-Stange'),
      this.findWorkoutByName('Klimmzüge')
    ]

    let legsWorkouts: Workout[] = [
      this.findWorkoutByName('Wadenheben'),
      this.findWorkoutByName('Beinpresse'),
      this.findWorkoutByName('Beinstreckermaschine'),
      this.findWorkoutByName('Beinbeugermaschine'),
      this.findWorkoutByName('Rückenstrecker')
    ];
    const push = DataFactory.createTrainingDay('Oberkörper', pushWorkouts);
    const pull = DataFactory.createTrainingDay('Unterkörper', pullWorkouts);
    const legs = DataFactory.createTrainingDay('Beine', legsWorkouts);
    this.days.push(push, pull, legs);
    this.presentSuccessToast('3er Split für Beginner');
    await this._dataService.createTrainingPlan(DataFactory.createTrainingPlan('3er Split Beginner', this.days));
  }

  async generateAdvancedGK() {
    let generatedWorkouts: Workout[] = [
      this.findWorkoutByName('Langhantel Bankdrücken'),
      this.findWorkoutByName('Squats'),
      this.findWorkoutByName('Kreuzheben'),
      this.findWorkoutByName('Klimmzüge'),
      this.findWorkoutByName('Kurzhantel Schulterpresse'),
      this.findWorkoutByName('Langhantelrudern')
    ];
    const newDay = DataFactory.createTrainingDay('Ganzkörpertraining Fortgeschritten', generatedWorkouts);
    this.days.push(newDay);
    this.presentSuccessToast('Ganzkörpertraining Fortgeschritten');
    await this._dataService.createTrainingPlan(DataFactory.createTrainingPlan('Ganzkörpertraining Fortgeschritten', this.days));
  }

  async generateAdvancedOKUK() {
    let upperBodyWorkouts: Workout[] = [
      this.findWorkoutByName('Langhantel Bankdrücken'),
      this.findWorkoutByName('Schrägbankdrücken'),
      this.findWorkoutByName('Klimmzüge'),
      this.findWorkoutByName('Kurzhantel Schulterpresse'),
      this.findWorkoutByName('Langhantelrudern'),
      this.findWorkoutByName('Bizepscurls Kurzhantel')
    ];

    let lowerBodyWorkouts: Workout[] = [
      this.findWorkoutByName('Wadenheben'),
      this.findWorkoutByName('Squats'),
      this.findWorkoutByName('Kreuzheben'),
      this.findWorkoutByName('Beinpresse'),
      this.findWorkoutByName('Beinstreckermaschine'),
      this.findWorkoutByName('Beinbeugermaschine')
    ];
    const upperBody = DataFactory.createTrainingDay('Oberkörper', upperBodyWorkouts);
    const lowerBody = DataFactory.createTrainingDay('Unterkörper', lowerBodyWorkouts);
    this.days.push(upperBody, lowerBody);
    this.presentSuccessToast('2er Split Fortgeschritten');
    await this._dataService.createTrainingPlan(DataFactory.createTrainingPlan('2er Split Fortgeschritten', this.days));
  }

  async generateAdvancedPPB() {
    let pushWorkouts: Workout[] = [
      this.findWorkoutByName('Langhantel Bankdrücken'),
      this.findWorkoutByName('Schrägbankdrücken'),
      this.findWorkoutByName('Kurzhantel Schulterpresse'),
      this.findWorkoutByName('Trizepsdips'),
      this.findWorkoutByName('Trizepscurls'),
      this.findWorkoutByName('Kurzhantel Seitheben')
    ];

    let pullWorkouts: Workout[] = [
      this.findWorkoutByName('Langhantelrudern'),
      this.findWorkoutByName('Klimmzüge'),
      this.findWorkoutByName('Kreuzheben'),
      this.findWorkoutByName('Latzugmaschine'),
      this.findWorkoutByName('Bizepscurls SZ-Stange'),
      this.findWorkoutByName('Bizepscurls Kurzhantel')
    ]

    let legsWorkouts: Workout[] = [
      this.findWorkoutByName('Wadenheben'),
      this.findWorkoutByName('Squats'),
      this.findWorkoutByName('Kreuzheben'),
      this.findWorkoutByName('Beinpresse'),
      this.findWorkoutByName('Beinstreckermaschine'),
      this.findWorkoutByName('Beinbeugermaschine'),
      this.findWorkoutByName('Ausfallschritte')
    ];
    const push = DataFactory.createTrainingDay('Oberkörper', pushWorkouts);
    const pull = DataFactory.createTrainingDay('Unterkörper', pullWorkouts);
    const legs = DataFactory.createTrainingDay('Beine', legsWorkouts);
    this.days.push(push, pull, legs);
    this.presentSuccessToast('3er Split Fortgeschritten');
    await this._dataService.createTrainingPlan(DataFactory.createTrainingPlan('3er Split Fortgeschritten', this.days));
  }

  findWorkoutByName(name: string): Workout {
    return this.Workouts.find(workout => workout.name == name)
  }

}
