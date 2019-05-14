export interface ITrainingPlan {
    id: number;
    active: boolean;
    name: string;
    days: ITrainingDay[];
}

export interface ITrainingDay {
    id: number;
    name: string;
    workouts: IWorkout[];
}

export enum EWorkoutType {
    BankDruecken = 1,
    Butterfly =  2,
    Dips = 3,
    TrizepsCurls = 4,
}

export interface IWorkout {
    id: number;
    type: EWorkoutType;
    name: string;
    repetitions: number;
    sets: number;
    weight?: number;
}


export interface IWorkoutHistoryItem {
    Date: Date; // getter/setter
    workout?: IWorkout,
    timestamp: string
}
