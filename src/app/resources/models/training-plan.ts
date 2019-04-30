import {IWorkout} from './workout';

export interface ITrainingPlan {
    id: number;
    name: string;
    days: ITrainingDay[];
}

export interface ITrainingDay {
    id: number;
    name: string;
    workouts: IWorkout[];
}

export class TrainingPlan implements ITrainingPlan{
    public static TrainingPlanId: number = 0;
    public id: number;
    constructor(public name: string, public days: ITrainingDay[]) {
        this.id = TrainingPlan.TrainingPlanId++;
    }
}

export class TrainingDay implements ITrainingDay{
    public static TrainingDayId: number = 0;
    public id: number;
    constructor(public  name:string, public workouts: IWorkout[]){
        this.id = TrainingDay.TrainingDayId++;
    }
}
