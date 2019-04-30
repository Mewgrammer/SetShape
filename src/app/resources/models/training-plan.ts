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
